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

    #[test]
    fun test_transfer_to_verified_user() {
        use sui::test_scenario;

        let data_holder = @0xCAFE;
        let user = @0xBEEF;

        // 1. data holder mint card
        let scenario_val = test_scenario::begin(data_holder);
        let scenario = &mut scenario_val;
        {
            mint(
                b"CardX",
                1,
                5_000,
                3_500,
                test_scenario::ctx(scenario)
            )
        };

        // 2. transfer the card to an user when the user inputs the correct password
        test_scenario::next_tx(scenario, data_holder);
        {
            // user cannot get card if password is changed
            let input_password = 000000;
            let res = isCorrectPassword(input_password);
            assert!(res == true, 0);
            let limited_card = test_scenario::take_from_sender<Card>(scenario);
            transfer::public_transfer(limited_card, user);
        };

        // 3. burn the card
        test_scenario::next_tx(scenario, user);
        {
            let limited_card = test_scenario::take_from_sender(scenario);
            burn(limited_card)
        };

        test_scenario::end(scenario_val);
    }
}