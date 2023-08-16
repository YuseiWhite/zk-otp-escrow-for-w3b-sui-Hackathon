module zk_nfp::kiosk{
    // confirm wheather you can utilize Kiosk or not
    use std::debug;

    use sui::kiosk_test_utils;
    use sui::test_scenario;


    #[test]
    fun get_kiosk_and_owner_cap() {
        // use std::debug;

        // use sui::kiosk_test_utils;
        // use sui::test_scenario;

        let data_holder = @0xCAFE;
        // let user = @0xBEEF;

        let scenario_val = test_scenario::begin(data_holder);
        // let scenario = &mut scenario_val;

        // 1st transaction
        {
            let ctx = &mut kiosk_test_utils::ctx();
            let (kiosk, kiosk_owner_cap) = kiosk_test_utils::get_kiosk(ctx);
            debug::print(&kiosk);
            debug::print(&kiosk_owner_cap);
            kiosk_test_utils::return_kiosk(kiosk, kiosk_owner_cap, ctx);
        };

        test_scenario::end(scenario_val);
    }
}