module zk_nfp::owner_cap {
    use sui::transfer;
    use std::string::String;
    use std::option::{Self, Option};
    use sui::package::{Self, Publisher};
    use sui::tx_context::{sender, TxContext};
    use sui::object::{Self, UID};
    use sui::transfer_policy::{
        Self as policy,
        TransferPolicyCap
    };

    /// Trying to `claim_ticket` with a non OTW struct.
    const ENotOneTimeWitness: u64 = 0;
    /// The type parameter `T` is not from the same module as the `OTW`.
    const ETypeNotFromModule: u64 = 1;
    /// Maximum size of the Collection is reached - minting forbidden.
    const ECapReached: u64 = 2;

    struct OwnerRegistry has key {
        id: UID,
        publisher: Publisher,
    }

    // it may be need <phantom: T>
    struct OwnerCap has key, store {
        id: UID,
        publisher: Publisher,
        // you need to use Referent if you need "borrow" / "return" cap
        // ref: https://github.com/MystenLabs/sui/blob/a583613cbdf89b90fd5641020f237beca3f54fd2/crates/sui-framework/packages/sui-framework/sources/borrow.move#L20
        policy_cap: TransferPolicyCap<Card>,
        max_supply: Option<u32>,
        minted: u32,
        burned: u32,
    }

    struct OwnerTicket<phantom T: store> has key, store {
        id: UID,
        publisher: Publisher,
        max_supply: Option<u32>,
    }

    struct Card has key, store {
        id: UID,
        name: String,
        level: u8, /// limitation is 100
        attack: u64,
        defense: u64,
        limited: bool,
        image_url: Option<String>,
    }

    /// one time witness for initialization
    /// the name of the module must be capitalized
    struct OWNER_CAP has drop {}

    fun init(otw: OWNER_CAP, ctx: &mut TxContext) {
        transfer::share_object(OwnerRegistry {
            id: object::new(ctx),
            publisher: package::claim(otw, ctx),
        })
    }

    public fun claim_ticket<OTW: drop, T: store>(otw: OTW, max_supply: Option<u32>, ctx: &mut TxContext) {
        assert!(sui::types::is_one_time_witness(&otw), ENotOneTimeWitness);

        let publisher = package::claim(otw, ctx);

        assert!(package::from_module<T>(&publisher), ETypeNotFromModule);
        transfer::transfer(OwnerTicket<T> {
            id: object::new(ctx),
            publisher,
            max_supply
        }, sender(ctx));
    }

    public fun create_owner_cap<T: store>(
        registry: &OwnerRegistry,
        ticket: OwnerTicket<T>,
        ctx: &mut TxContext
    ): OwnerCap {
        let OwnerTicket { id, publisher, max_supply } = ticket;
        // to make it immutable?
        object::delete(id);

        // let display = display::new<Card>(&publisher, ctx);
        let (policy, policy_cap) = policy::new<Card>(
            &registry.publisher, ctx
        );

        transfer::public_share_object(policy);

        OwnerCap {
            id: object::new(ctx),
            publisher,
            policy_cap,
            max_supply,
            minted: 0,
            burned: 0,
        }
    }

    public fun mint(
        cap: &mut OwnerCap,
        name: String,
        level: u8,
        attack: u64,
        defense: u64,
        limited: bool,
        image_url: Option<String>,
        ctx: &mut TxContext
    ): Card {
        assert!(option::is_none(&cap.max_supply) || *option::borrow(&cap.max_supply) > cap.minted, ECapReached);
        cap.minted = cap.minted + 1;
        Card {
            id: object::new(ctx),
            name,
            level,
            attack,
            defense,
            limited,
            image_url,
        }
    }
}