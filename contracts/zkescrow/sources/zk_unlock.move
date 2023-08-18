module zk_escrow::zk_unlock {
    use std::string::{utf8, String};
    use std::vector::{Self};

    use sui::tx_context::{sender, TxContext};
    use sui::transfer;
    use sui::object::{Self, UID, ID};
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};
    use sui::transfer_policy::{Self as policy, TransferPolicy, TransferPolicyCap};
    use sui::coin::{Self};
    use sui::sui::SUI;
    use sui::display;
    use sui::package::{Self, Publisher};

    use zk_escrow::utils;
    use zk_escrow::proof_policy;

    /// Trying to destroy the Unlocker object while not being its publisher.
    const ENotPublisher: u64 = 0;

    struct Unlocker<phantom T> has key, store {
        id: UID,
        policy: TransferPolicy<T>,
        cap: TransferPolicyCap<T>,
    }

    public fun new_unlock<T: key + store>(
        publisher: &Publisher,
        ctx: &mut TxContext
    ): Unlocker<T> {
        let (policy, cap) = policy::new(publisher, ctx);
        Unlocker { cap, policy, id: object::new(ctx) }
    }

    public fun unlock<T: key + store>(
        self: &Unlocker<T>,
        kiosk: &mut Kiosk,
        cap: &KioskOwnerCap,
        item_id: ID,
        ctx: &mut TxContext
    ): T {
        let p_cap = kiosk::list_with_purchase_cap(kiosk, cap, item_id, 0, ctx);
        let (item, request) = kiosk::purchase_with_cap(kiosk, p_cap, coin::zero(ctx));

        policy::confirm_request(&self.policy, request);
        item
    }

    public fun destroy<T: key + store>(
        self: Unlocker<T>,
        publisher: &Publisher,
        ctx: &mut TxContext
    ) {
        assert!(package::from_package<T>(publisher), ENotPublisher);

        let Unlocker { id, policy, cap } = self;
        let zero = policy::destroy_and_withdraw(policy, cap, ctx);
        coin::destroy_zero(zero);
        object::delete(id);
    }

    public fun get_asset(
        ctx: &mut TxContext
    ): (utils::Asset, ID) {
        let (asset, asset_id) = utils::get_asset(ctx);
        (asset, asset_id)
    }

    struct Proof has drop {}

    public fun do_unlock<T: key + store>(
        publisher: &Publisher,
        ctx: &mut TxContext
    ) {
        let (kiosk, kiosk_cap) = utils::get_kiosk(ctx);
        let (policy, policy_cap) = policy::new(publisher, ctx);
        proof_policy::set<T, Proof>(&mut policy, &policy_cap);

        let (asset, asset_id) = get_asset(ctx);
        kiosk::place_and_list(&mut kiosk, &kiosk_cap, asset, 0);
        assert!(kiosk::is_listed(&kiosk, asset_id), 0);

        let (asset, request) = kiosk::purchase(&mut kiosk, asset_id, coin::zero(ctx));
        assert!(!kiosk::is_listed(&kiosk, asset_id), 0);

        {
            // let request = policy::new_request<T>(

            //     asset_id,
            //     0,
            //     object::id(&kiosk),
            // );
            let vk_bytes = x"ada3c24e8c2e63579cc03fd1f112a093a17fc8ab0ff6eee7e04cab7bf8e03e7645381f309ec113309e05ac404c77ac7c8585d5e4328594f5a70a81f6bd4f29073883ee18fd90e2aa45d0fc7376e81e2fdf5351200386f5732e58eb6ff4d318dc";
            let inputs_bytes = x"440758042e68b76a376f2fecf3a5a8105edb194c3e774e5a760140305aec8849";
            let proof_bytes = x"a29981304df8e0f50750b558d4de59dbc8329634b81c986e28e9fff2b0faa52333b14a1f7b275b029e13499d1f5dd8ab955cf5fa3000a097920180381a238ce12df52207597eade4a365a6872c0a19a39c08a9bfb98b69a15615f90cc32660180ca32e565c01a49b505dd277713b1eae834df49643291a3601b11f56957bde02d5446406d0e4745d1bd32c8ccb8d8e80b877712f5f373016d2ecdeebb58caebc7a425b8137ebb1bd0c5b81c1d48151b25f0f24fe9602ba4e403811fb17db6f14";
            proof_policy::prove(
                Proof {},
                &policy,
                &mut request,
                vk_bytes,
                inputs_bytes,
                proof_bytes,
            );
        };

        policy::confirm_request(&policy, request);

        transfer::public_transfer(asset, sender(ctx));

        utils::return_kiosk(kiosk, kiosk_cap, ctx);
        let profits = policy::destroy_and_withdraw(policy, policy_cap, ctx);
        coin::destroy_zero(profits);

    }

    public fun maybe_fail<T: key + store>(
        publisher: &Publisher,
        ctx: &mut TxContext
    ) {
        let (kiosk, kiosk_cap) = utils::get_kiosk(ctx);
        let (policy, policy_cap) = policy::new(publisher, ctx);
        proof_policy::set<T, Proof>(&mut policy, &policy_cap);

        let (asset, asset_id) = get_asset(ctx);
        kiosk::place_and_list(&mut kiosk, &kiosk_cap, asset, 0);
        assert!(kiosk::is_listed(&kiosk, asset_id), 0);

        let (asset, request) = kiosk::purchase(&mut kiosk, asset_id, coin::zero(ctx));
        assert!(!kiosk::is_listed(&kiosk, asset_id), 0);

        {
            // let request = policy::new_request<T>(

            //     asset_id,
            //     0,
            //     object::id(&kiosk),
            // );
            let vk_bytes = x"12";
            let inputs_bytes = x"34";
            let proof_bytes = x"56";
            proof_policy::prove(
                Proof {},
                &policy,
                &mut request,
                vk_bytes,
                inputs_bytes,
                proof_bytes,
            );
        };

        policy::confirm_request(&policy, request);

        transfer::public_transfer(asset, sender(ctx));

        utils::return_kiosk(kiosk, kiosk_cap, ctx);
        let profits = policy::destroy_and_withdraw(policy, policy_cap, ctx);
        coin::destroy_zero(profits);

    }
}
