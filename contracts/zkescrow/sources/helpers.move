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

    use zk_escrow::utils;
    use zk_escrow::proof_policy;

    public fun prove_and_claim<T>(
        policy: &mut TransferPolicy<T>,
        request: TransferRequest<T>,
    ) {
        proof_policy::prove<T>(
            policy,
            &mut request,
            x"",
            x"",
            x"",
        );

        transfer_policy::confirm_request<T>(
            policy,
            request,
        );
    }
}
