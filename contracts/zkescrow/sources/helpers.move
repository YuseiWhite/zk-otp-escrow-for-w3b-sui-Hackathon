module zk_escrow::helpers {
    use std::string::{utf8, String};
    use std::vector::{Self};

    use sui::tx_context::{sender, TxContext};
    use sui::transfer;
    use sui::object::{Self, UID, ID};
    use sui::kiosk::{Self, Kiosk, KioskOwnerCap};
    use sui::transfer_policy::{Self, TransferPolicy, TransferPolicyCap, TransferRequest};
    use sui::coin::{Self};
    use sui::sui::SUI;
    use sui::display;
    use sui::package::{Self, Publisher};
    use sui::event;

    use zk_escrow::utils;
    use zk_escrow::proof_policy;

    struct LogObjectIdEvent has copy, drop {
        object_id: ID,
    }

    public fun log_object_id<T: key>(
        object: &T,
    ) {
        let object_id = object::id(object);
        event::emit(LogObjectIdEvent {
            object_id,
        });
    }

    public fun prove_and_claim<T>(
        policy: &mut TransferPolicy<T>,
        request: TransferRequest<T>,
        vk_bytes: vector<u8>,
        public_inputs_bytes: vector<u8>,
        proof_points_bytes: vector<u8>,
    ) {
        proof_policy::prove<T>(
            policy,
            &mut request,
            vk_bytes,
            public_inputs_bytes,
            proof_points_bytes,
        );

        transfer_policy::confirm_request<T>(
            policy,
            request,
        );
    }
}
