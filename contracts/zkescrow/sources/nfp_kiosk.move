module zk_escrow::nfp_kiosk{
    use std::debug;
    use std::string;
    use std::option::{Self, Option};

    use sui::transfer;
    use sui::event;
    use sui::tx_context::{sender, TxContext};
    use sui::object::{Self, ID, UID};
    use sui::transfer_policy::{
        Self as policy,
        TransferPolicyCap
    };

    struct Card has key, store {
        id: UID,
        name: string::String,
        level: u8, /// limitation is 100
        attack: u64,
        defense: u64,
        limited: bool,
        // image_url: Option<String>,
    }

    struct MintCardEvent has copy, drop {
        object_id: ID,
        creator: address,
        name: string::String,
    }

    public fun mint(
        // cap: &mut OwnerCap,
        name: vector<u8>,
        level: u8,
        attack: u64,
        defense: u64,
        limited: bool,
        // image_url: Option<String>,
        ctx: &mut TxContext
    ) {
    // ): Card {
        // assert!(option::is_none(&cap.max_supply) || *option::borrow(&cap.max_supply) > cap.minted, ECapReached);
        // cap.minted = cap.minted + 1;
        let limited_card = Card {
            id: object::new(ctx),
            name: string::utf8(name),
            level: level,
            attack: attack,
            defense: defense,
            limited: limited,
            // image_url,
        };
        let data_holder = sender(ctx);
        event::emit(MintCardEvent {
            object_id: object::uid_to_inner(&limited_card.id),
            creator: data_holder,
            name: limited_card.name,
        });
        transfer::public_transfer(limited_card, data_holder);
        // debug::print(&limited_card.id);
        // limited_card
    }

}

#[test_only]
module zk_escrow::nfp_kiosk_test{
    use std::debug;

    use sui::kiosk;
    use sui::test_scenario;
    use sui::kiosk_test_utils::{Self as kiosk_test, Asset};
    use sui::transfer_policy_tests::{
        Self as policy_test,
    };

    use std::string::String;
    use std::option::{Self, Option};

    use sui::transfer;
    use sui::event;
    use sui::tx_context::{sender, TxContext};
    use sui::object::{Self, ID, UID};
    use sui::transfer_policy::{
        Self as policy,
        TransferPolicyCap
    };

    use zk_escrow::proof_policy;
    use zk_escrow::nfp_kiosk::{Self, Card};

    struct Proof has drop {}

    // dont use owner_cap.move
    #[test]
    fun test_user_can_get_card() {
        let data_holder = @0xCAFE;
        let user = @0xBEEF;

        let scenario_val = test_scenario::begin(data_holder);
        let scenario = &mut scenario_val;
        {
            // mint() `cardX`
            // let card =
            nfp_kiosk::mint(
                b"CardX",
                1,
                5_000,
                3_000,
                true,
                test_scenario::ctx(scenario),
            );
        };

        test_scenario::next_tx(scenario, data_holder);
        {
            // create kiosk id of data holder if it don't have kiosk id
            // case 1: data holder is a game company
            // need to confirm whather data holde have kiosk id or not in product environment
            // kiosk::new(ctx: &mut TxContext): (Kiosk, KioskOwnerCap)
            let (kiosk, owner_cap) = kiosk_test::get_kiosk(test_scenario::ctx(scenario));
            let old_owner = kiosk::owner(&kiosk);
            kiosk::set_owner(&mut kiosk, &owner_cap, test_scenario::ctx(scenario));
            assert!(kiosk::owner(&kiosk) == old_owner, 0);

            // debug::print(&), print the content of kiosk of data holder
            // debug::print(&kiosk);
            // debug::print(&owner_cap);
            kiosk_test::return_kiosk(kiosk, owner_cap, test_scenario::ctx(scenario));
        };

        // test_scenario::next_tx(scenario, data_holder);
        // {
            // add rule
            // let (policy, cap) = policy_test::prepare(test_scenario::ctx(scenario));
            // public fun prepare(ctx: &mut TxContext): (TransferPolicy<Asset>, TransferPolicyCap<Asset>) {
            //     let publisher = package::test_claim(OTW {}, ctx);
            //     let (policy, cap) = policy::new<Asset>(&publisher, ctx);
            //     package::burn_publisher(publisher);
            //     (policy, cap)
            // }
            // `Card` have to have uid // struct Asset has key, store { id: UID }

            // need to get publisher
            // policy::new<Card>(&publisher, test_scenario::ctx(scenario))

            // public fun new<T>(
            //     pub: &Publisher, ctx: &mut TxContext
            // ): (TransferPolicy<T>, TransferPolicyCap<T>) {
            //     assert!(package::from_package<T>(pub), 0);
            //     let id = object::new(ctx);
            //     let policy_id = object::uid_to_inner(&id);

            //     event::emit(TransferPolicyCreated<T> { id: policy_id });

            //     (
            //         TransferPolicy { id, rules: vec_set::empty(), balance: balance::zero() },
            //         TransferPolicyCap { id: object::new(ctx), policy_id }
            //     )
            // }
            // maybe Assets -> Card
            // proof_policy::set<Asset, Proof>(&mut policy, &cap);
        // };

        // test_scenario::next_tx(scenario, data_holder);
        // {
        //     // data holder place CardX
        //     // let card_id = object::uid_to_inner(&card_uid);

        //     // Are Rule of Transfer Policy already confirmed here?
        //     let publisher = policy_test::get_publisher(test_scenario::ctx(scenario));
        //     // let (policy, cap) = policy::new<Card>(&publisher, test_scenario::ctx(scenario));
        //     return_publisher(publisher);
        //     kiosk::place(&mut kiosk, &owner_cap, asset);
        //     assert!(kiosk::has_item(&kiosk, card_id), 0);
        // };

        // delete
        // test_scenario::next_tx(scenario, data_holder);
        // {
        //     // policy_test::return_policy(policy, policy_cap, test_scenario::ctx(scenario));
        //     kiosk_test::return_kiosk(kiosk, owner_cap, test_scenario::ctx(scenario));
        //     // policy_test::return_assets(vector[ card_uid ]);
        // };

        // data holder lock CardX


        // data holder list CardX

        // policy::new_request()
        // do new transfer request following transfer policy

        // prove() and confirm_request()
        // verify user, in test case, user can pass it absolutely

        // user can get purchaseCap

        // use can purchase CardX to pay 0 SUI

        // cpnfirm wheather user have CardX or not
        test_scenario::end(scenario_val);
    }
}
