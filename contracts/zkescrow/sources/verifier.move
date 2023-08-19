module zk_escrow::verifier {
    use sui::event;
    use sui::groth16::{Self, bls12381, bn254};
    use std::vector;
    use std::debug;

    struct VerifiedEvent has copy, drop {
        is_verified: bool,
    }

    struct VerifyingKeyEvent has copy, drop {
        delta_bytes: vector<u8>,
        gamma_bytes: vector<u8>,
        alpha_bytes: vector<u8>,
        vk_bytes: vector<u8>,
    }

    struct JustEvent has copy, drop {
        vk_bytes: vector<u8>,
    }

    public fun verify_proof(
        vk_bytes: vector<u8>,
        public_inputs_bytes: vector<u8>,
        proof_points_bytes: vector<u8>,
    ): bool {
        let pvk = groth16::prepare_verifying_key(&groth16::bn254(), &vk_bytes);
        let public_inputs = groth16::public_proof_inputs_from_bytes(public_inputs_bytes);
        let proof_points = groth16::proof_points_from_bytes(proof_points_bytes);
        let is_verified= groth16::verify_groth16_proof(
            &groth16::bn254(),
            &pvk,
            &public_inputs,
            &proof_points,
        );
        event::emit(VerifiedEvent {
            is_verified: is_verified,
        });

        is_verified
    }

    public entry fun just(vk: vector<u8>) {
        use std::debug;
        debug::print(&vk);
        let arr = groth16::pvk_to_bytes(groth16::prepare_verifying_key(&bn254(), &vk));
        let delta_bytes = vector::pop_back(&mut arr);
        let gamma_bytes = vector::pop_back(&mut arr);
        let alpha_bytes = vector::pop_back(&mut arr);
        let vk_bytes = vector::pop_back(&mut arr);

        debug::print(&delta_bytes);
        debug::print(&gamma_bytes);
        debug::print(&alpha_bytes);
        debug::print(&vk_bytes);

        let expected_gamma_bytes = x"6030ca5b462a3502d560df7ff62b7f1215195233f688320de19e4b3a2a2cb6120ae49bcc0abbd3cbbf06b29b489edbf86e3b679f4e247464992145f468e3c00d";
        let expected_delta_bytes = x"b41e5e09002a7170cb4cc56ae96b152d17b6b0d1b9333b41f2325c3c8a9d2e2df98f8e2315884fae52b3c6bb329df0359daac4eff4d2e7ce729078b10d79d4af";
        let expected_alpha_bytes = x"61665b255f20b17bbd56b04a9e4d6bf596cb8d578ce5b2a9ccd498e26d394a3071485596cabce152f68889799f7f6b4e94d415c28e14a3aa609e389e344ae72778358ca908efe2349315bce79341c69623a14397b7fa47ae3fa31c6e41c2ee1b6ab50ef5434c1476d9894bc6afee68e0907b98aa8dfa3464cc9a122b247334064ff7615318b47b881cef4869f3dbfde38801475ae15244be1df58f55f71a5a01e28c8fa91fac886b97235fddb726dfc6a916483464ea130b6f82dc602e684b14f5ee655e510a0c1dd6f87b608718cd19d63a914f745a80c8016aa2c49883482aa28acd647cf9ce56446c0330fe6568bc03812b3bda44d804530abc67305f4914a509ecdc30f0b88b1a4a8b11e84856b333da3d86bb669a53dbfcde59511be60d8d5f7c79faa4910bf396ab04e7239d491e0a3bee177e6c9aac0ecbcd09ca850afcd46f25410849cefcfbdac828e7b057d4a732a373aad913d4b767897ba15d0bfcbcbb25bc5f2dae1ea59196ede9666a5c260f054b1a64977666af6a03076409";
        let expected_vk_bytes = x"1dcc52e058148a622c51acfdee6e181252ec0e9717653f0be1faaf2a68222e0dd2ccf4e1e8b088efccfdb955a1ff4a0fd28ae2ccbe1a112449ddae8738fb40b0";

        assert!(delta_bytes == expected_delta_bytes, 1003);
        assert!(gamma_bytes == expected_gamma_bytes, 1004);
        assert!(alpha_bytes == expected_alpha_bytes, 1005);
        assert!(vk_bytes == expected_vk_bytes, 1006);

        event::emit(VerifyingKeyEvent {
            delta_bytes: delta_bytes,
            gamma_bytes: gamma_bytes,
            alpha_bytes: alpha_bytes,
            vk_bytes: vk_bytes,
        });

        event::emit(JustEvent {
            vk_bytes: vk,
        });
    }

    public entry fun parse_pvk_from_vk(vk: vector<u8>) {
        use std::debug;
        debug::print(&vk);

        let arr = groth16::pvk_to_bytes(groth16::prepare_verifying_key(&bn254(), &vk));
        let delta_bytes = vector::pop_back(&mut arr);
        let gamma_bytes = vector::pop_back(&mut arr);
        let alpha_bytes = vector::pop_back(&mut arr);
        let vk_bytes = vector::pop_back(&mut arr);

        event::emit(VerifyingKeyEvent {
            delta_bytes: delta_bytes,
            gamma_bytes: gamma_bytes,
            alpha_bytes: alpha_bytes,
            vk_bytes: vk_bytes,
        })
    }

    public entry fun do_just() {
        let vk = x"53d75f472c207c7fcf6a34bc1e50cf0d7d2f983dd2230ffcaf280362d162c3871cae3e4f91b77eadaac316fe625e3764fb39af2bb5aa25007e9bc6b116f6f02f597ad7c28c4a33da5356e656dcef4660d7375973fe0d7b6dc642d51f16b6c8806030ca5b462a3502d560df7ff62b7f1215195233f688320de19e4b3a2a2cb6120ae49bcc0abbd3cbbf06b29b489edbf86e3b679f4e247464992145f468e3c08db41e5e09002a7170cb4cc56ae96b152d17b6b0d1b9333b41f2325c3c8a9d2e2df98f8e2315884fae52b3c6bb329df0359daac4eff4d2e7ce729078b10d79d42f02000000000000001dcc52e058148a622c51acfdee6e181252ec0e9717653f0be1faaf2a68222e0dd2ccf4e1e8b088efccfdb955a1ff4a0fd28ae2ccbe1a112449ddae8738fb40b0";
        just(vk);
    }

    public entry fun do_verify() {
        let vk_bytes = vector<u8>[
            249, 164, 2, 202, 97, 73, 144, 8, 163, 188, 54, 61, 53, 98, 117, 213, 228, 106, 3, 107, 40, 136, 231, 243, 103, 77, 164, 54, 84, 203, 161, 169, 182, 141, 124, 116, 26, 214, 54, 146, 155, 246, 27, 30, 45, 52, 183, 63, 53, 240, 11, 70, 89, 4, 230, 116, 19, 69, 218, 148, 214, 35, 39, 20, 14, 231, 213, 41, 206, 112, 103, 138, 188, 10, 86, 61, 26, 21, 7, 204, 132, 96, 21, 158, 63, 239, 230, 104, 18, 181, 21, 221, 110, 165, 59, 14, 106, 243, 91, 162, 14, 189, 113, 197, 12, 100, 115, 167, 251, 221, 152, 149, 47, 250, 107, 30, 94, 63, 27, 193, 235, 57, 227, 53, 195, 183, 248, 17, 176, 111, 223, 252, 223, 41, 40, 236, 255, 0, 163, 27, 190, 192, 141, 0, 125, 14, 239, 164, 114, 90, 38, 214, 84, 181, 187, 144, 25, 50, 183, 8, 160, 39, 245, 25, 25, 22, 90, 242, 15, 62, 116, 20, 125, 106, 200, 70, 85, 49, 211, 155, 165, 206, 236, 236, 10, 91, 35, 161, 178, 248, 157, 45, 27, 203, 143, 52, 123, 123, 175, 163, 251, 157, 172, 66, 85, 57, 58, 64, 65, 58, 219, 42, 93, 156, 220, 141, 172, 218, 144, 152, 92, 176, 205, 21, 2, 0, 0, 0, 0, 0, 0, 0, 203, 98, 154, 66, 73, 90, 211, 42, 148, 72, 68, 211, 67, 24, 67, 181, 169, 92, 69, 146, 152, 193, 21, 202, 86, 0, 250, 131, 203, 219, 3, 0, 230, 18, 243, 17, 80, 60, 138, 238, 7, 12, 230, 201, 102, 62, 111, 59, 166, 73, 229, 71, 186, 187, 199, 201, 56, 50, 2, 143, 181, 207, 33, 167
        ];
        let public_inputs_bytes = vector<u8>[
            33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        let proof_points_bytes= vector<u8>[
            87, 100, 142, 95, 149, 143, 27, 207, 198, 130, 139, 75, 87, 157, 251, 144, 23, 158, 71, 46, 109, 243, 137, 146, 93, 154, 144, 197, 223, 181, 198, 159, 114, 110, 26, 136, 41, 98, 9, 110, 254, 254, 142, 246, 71, 246, 145, 49, 162, 56, 144, 133, 234, 227, 146, 115, 13, 7, 56, 171, 246, 165, 3, 25, 87, 247, 112, 52, 165, 206, 47, 77, 39, 103, 94, 246, 126, 140, 20, 226, 70, 215, 51, 161, 234, 217, 151, 177, 163, 77, 188, 129, 194, 154, 216, 3, 7, 220, 162, 37, 247, 56, 18, 156, 217, 185, 3, 215, 214, 205, 59, 195, 8, 105, 235, 51, 73, 84, 218, 210, 28, 223, 84, 115, 169, 18, 193, 135
        ];

        let vk = x"e8324a3242be5193eb38cca8761691ce061e89ce86f1fce8fd7ef40808f12da3c67d9ed5667c841f956e11adbbe240ddf37a1e3a4a890600dc88f608b897898e";
        debug::print(&1234567);
        debug::print(&vk);
        debug::print(&vk_bytes);

        // u256 vector<u8>

        let pvk = groth16::prepare_verifying_key(&groth16::bn254(), &vk_bytes);
        let public_inputs = groth16::public_proof_inputs_from_bytes(public_inputs_bytes);
        let proof_points = groth16::proof_points_from_bytes(proof_points_bytes);
        let is_verified= groth16::verify_groth16_proof(&groth16::bn254(), &pvk, &public_inputs, &proof_points);
        debug::print(&is_verified);
    }

    #[test]
    public entry fun test_verify() {
        do_verify()
    }

    #[test]
    public entry fun test_just() {
        do_just()
    }

    #[test]
    fun test_prepare_verifying_key_bn254() {
        let vk = x"53d75f472c207c7fcf6a34bc1e50cf0d7d2f983dd2230ffcaf280362d162c3871cae3e4f91b77eadaac316fe625e3764fb39af2bb5aa25007e9bc6b116f6f02f597ad7c28c4a33da5356e656dcef4660d7375973fe0d7b6dc642d51f16b6c8806030ca5b462a3502d560df7ff62b7f1215195233f688320de19e4b3a2a2cb6120ae49bcc0abbd3cbbf06b29b489edbf86e3b679f4e247464992145f468e3c08db41e5e09002a7170cb4cc56ae96b152d17b6b0d1b9333b41f2325c3c8a9d2e2df98f8e2315884fae52b3c6bb329df0359daac4eff4d2e7ce729078b10d79d42f02000000000000001dcc52e058148a622c51acfdee6e181252ec0e9717653f0be1faaf2a68222e0dd2ccf4e1e8b088efccfdb955a1ff4a0fd28ae2ccbe1a112449ddae8738fb40b0";
        let arr = groth16::pvk_to_bytes(groth16::prepare_verifying_key(&bn254(), &vk));

        let expected_vk_bytes = x"1dcc52e058148a622c51acfdee6e181252ec0e9717653f0be1faaf2a68222e0dd2ccf4e1e8b088efccfdb955a1ff4a0fd28ae2ccbe1a112449ddae8738fb40b0";
        let expected_alpha_bytes = x"61665b255f20b17bbd56b04a9e4d6bf596cb8d578ce5b2a9ccd498e26d394a3071485596cabce152f68889799f7f6b4e94d415c28e14a3aa609e389e344ae72778358ca908efe2349315bce79341c69623a14397b7fa47ae3fa31c6e41c2ee1b6ab50ef5434c1476d9894bc6afee68e0907b98aa8dfa3464cc9a122b247334064ff7615318b47b881cef4869f3dbfde38801475ae15244be1df58f55f71a5a01e28c8fa91fac886b97235fddb726dfc6a916483464ea130b6f82dc602e684b14f5ee655e510a0c1dd6f87b608718cd19d63a914f745a80c8016aa2c49883482aa28acd647cf9ce56446c0330fe6568bc03812b3bda44d804530abc67305f4914a509ecdc30f0b88b1a4a8b11e84856b333da3d86bb669a53dbfcde59511be60d8d5f7c79faa4910bf396ab04e7239d491e0a3bee177e6c9aac0ecbcd09ca850afcd46f25410849cefcfbdac828e7b057d4a732a373aad913d4b767897ba15d0bfcbcbb25bc5f2dae1ea59196ede9666a5c260f054b1a64977666af6a03076409";
        let expected_gamma_bytes = x"6030ca5b462a3502d560df7ff62b7f1215195233f688320de19e4b3a2a2cb6120ae49bcc0abbd3cbbf06b29b489edbf86e3b679f4e247464992145f468e3c00d";
        let expected_delta_bytes = x"b41e5e09002a7170cb4cc56ae96b152d17b6b0d1b9333b41f2325c3c8a9d2e2df98f8e2315884fae52b3c6bb329df0359daac4eff4d2e7ce729078b10d79d4af";

        let delta_bytes = vector::pop_back(&mut arr);
        assert!(delta_bytes == expected_delta_bytes, 0);

        let gamma_bytes = vector::pop_back(&mut arr);
        assert!(gamma_bytes == expected_gamma_bytes, 0);

        let alpha_bytes = vector::pop_back(&mut arr);
        assert!(alpha_bytes == expected_alpha_bytes, 0);

        let vk_bytes = vector::pop_back(&mut arr);
        assert!(vk_bytes == expected_vk_bytes, 0);


        parse_pvk_from_vk(vk);
    }

}
