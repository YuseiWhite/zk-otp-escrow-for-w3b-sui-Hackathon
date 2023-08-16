module zk_nfp::proof_policy {
    use sui::transfer_policy::{
        Self as policy,
        TransferPolicy,
        TransferPolicyCap,
        TransferRequest
    };

    const ERuleNotFound: u64 = 0;

    struct Rule<phantom Proof: drop> has drop {}

    /// `Config` is not required because there are no variables to be input by data_holder.
    
    /// data holder action
    public fun set<T, Proof: drop>(
        policy: &mut TransferPolicy<T>,
        cap: &TransferPolicyCap<T>
    ) {
        policy::add_rule(Rule<Proof> {}, policy, cap, true);
    }

    /// user action
    public fun prove<T, Proof: drop>(
        _proof: Proof,
        policy: &TransferPolicy<T>,
        request: &mut TransferRequest<T>
    ) {
        assert!(policy::has_rule<T, Rule<Proof>>(policy), ERuleNotFound);
        policy::add_receipt(Rule<Proof> {}, request)
    }
}

#[test_only]
module zk_nfp::proof_policy_test {
    // use std::debug;
    use sui::transfer_policy::{
        Self as policy,
        TransferPolicy,
        TransferPolicyCap,
        TransferRequest
    };
    use sui::transfer_policy_tests::{
        Self as policy_test,
        Asset
    };
    use sui::tx_context::{Self, TxContext};

    use zk_nfp::proof_policy;

    struct Proof has drop {}

    // If an user has `Proof`, the user can receive the receipt.
    #[test]
    fun test_proof() {
        let ctx = &mut tx_context::dummy();
        let (policy, cap) = policy_test::prepare(ctx);
        // why use Asset
        proof_policy::set<Asset, Proof>(&mut policy, &cap);

        // `Asset` -> `Card` in production environment
        let request = policy::new_request<Asset>(
            policy_test::fresh_id(ctx),
            0,
            policy_test::fresh_id(ctx),
        );
        proof_policy::prove(Proof {}, &policy, &mut request);
        let (item, paid, from) = policy::confirm_request(&policy, request);
        // debug::print(&item);
        // debug::print(&paid);
        // debug::print(&from);
        policy_test::wrapup(policy, cap, ctx);
    }
}