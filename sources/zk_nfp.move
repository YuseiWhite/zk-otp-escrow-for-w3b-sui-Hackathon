module zk_nfp::zk_nfp {
        use std::string;

    use sui::event;
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Card has key, store {
        id: UID,
        name: string::String,
        level: u8, // limitation is 100
        attack: u64,
        defense: u64,
        // url: Url, // if you need
    }

    struct MintCardEvent has copy, drop {
        object_id: ID,
        creator: address,
        name: string::String,
    }

    struct TransferCardEvent has copy, drop {
        object_id: ID,
        from: address,
        to: address,
    }

    public entry fun mint(
        name: vector<u8>, // str
        level: u8,
        attack: u64,
        defense: u64,
        ctx: &mut TxContext,
    ) {
        let limited_card = Card {
            id: object::new(ctx),
            name: string::utf8(name),
            level: level,
            attack: attack,
            defense: defense,
        };
        // get sender info
        let sender = tx_context::sender(ctx);
        // emit event
        event::emit(MintCardEvent {
            object_id: object::uid_to_inner(&limited_card.id),
            creator: sender,
            name: limited_card.name,
        });
        // transfer limited_card to sender
        transfer::public_transfer(limited_card, sender);
    }

    fun isCorrectPassword(
        input_password: u8,
    ): bool {
        // you need to change the password in production environment
        let correct_password = 000000;
        input_password == correct_password
    }

    public entry fun transfer(
        limited_card: Card,
        recipient: address,
        _: &mut TxContext
    ) {
        // transfer NFT Object
        transfer::public_transfer(limited_card, recipient)
    }

    public entry fun burn(card: Card) {
        let Card { id, name: _, level: _, attack: _, defense: _ } = card;
        object::delete(id)
    }
}