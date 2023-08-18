module zk_escrow::unlock {
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

    public fun do_unlock<T: key + store>(
        publisher: &Publisher,
        ctx: &mut TxContext
    ) {
        let (kiosk, kiosk_cap) = utils::get_kiosk(ctx);
        let (policy, policy_cap) = policy::new(publisher, ctx);
        let unlocker = new_unlock<T>(publisher, ctx);
        let (asset, asset_id) = get_asset(ctx);
        kiosk::lock(&mut kiosk, &kiosk_cap, &policy, asset);
        let asset = unlock(&unlocker, &mut kiosk, &kiosk_cap, asset_id, ctx);
        destroy(unlocker, publisher, ctx);

        utils::return_policy(policy, policy_cap, ctx);
        utils::return_kiosk(kiosk, kiosk_cap, ctx);

        transfer::public_transfer(asset, sender(ctx));
    }
}
