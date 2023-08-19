use std::collections::HashMap;

pub use ark_bn254::{Bn254 as Curve, Fr};
use ark_circom::{CircomBuilder, CircomConfig};
use ark_crypto_primitives::snark::SNARK;
use ark_ec::bn::G2Prepared;
use ark_groth16::Proof;
use ark_groth16::{Groth16, PreparedVerifyingKey as ArkPreparedVerifyingKey};
use ark_serialize::CanonicalDeserialize;
use ark_std::rand::thread_rng;
use fastcrypto::error::FastCryptoError;
use fastcrypto_zkp::bn254::api::SCALAR_SIZE;
use fastcrypto_zkp::bn254::verifier::{process_vk_special, PreparedVerifyingKey};

use crate::helpers::serialize_to_bytes;

type CircomInput = HashMap<String, Vec<num_bigint::BigInt>>;

pub fn verify_groth16(
    pvk: &PreparedVerifyingKey,
    proof_public_inputs_as_bytes: &[u8],
    proof_points_as_bytes: &[u8],
) -> Result<bool, FastCryptoError> {
    let proof = Proof::<Curve>::deserialize_compressed(proof_points_as_bytes)
        .map_err(|_| FastCryptoError::InvalidInput)?;
    let mut public_inputs = Vec::new();
    for chunk in proof_public_inputs_as_bytes.chunks(SCALAR_SIZE) {
        public_inputs
            .push(Fr::deserialize_compressed(chunk).map_err(|_| FastCryptoError::InvalidInput)?);
    }
    let ark_pkv = {
        let mut ark_pvk = ArkPreparedVerifyingKey::default();
        ark_pvk.vk.gamma_abc_g1 = pvk.vk_gamma_abc_g1.clone();
        ark_pvk.alpha_g1_beta_g2 = pvk.alpha_g1_beta_g2;
        ark_pvk.gamma_g2_neg_pc = G2Prepared::from(&pvk.gamma_g2_neg_pc);
        ark_pvk.delta_g2_neg_pc = G2Prepared::from(&pvk.delta_g2_neg_pc);
        ark_pvk
    };

    Groth16::<Curve>::verify_with_processed_vk(&ark_pkv, &public_inputs, &proof)
        .map_err(|e| FastCryptoError::GeneralError(e.to_string()))
}

pub fn verify_proof_with_r1cs(
    inputs: CircomInput,
    wasm_path: &str,
    r1cs_path: &str,
) -> (Vec<u8>, Vec<u8>, Vec<u8>) {
    dbg!("inputs", &inputs);
    let cfg = CircomConfig::<Curve>::new(wasm_path, r1cs_path).unwrap();

    let mut builder = CircomBuilder::new(cfg);
    for (k, v) in inputs {
        for e in v {
            builder.push_input(&k, e);
        }
    }
    let circuit = builder.setup();

    let mut rng = thread_rng();
    let params =
        Groth16::<Curve>::generate_random_parameters_with_reduction(circuit, &mut rng).unwrap();
    let circuit = builder.build().unwrap();

    let inputs = circuit.get_public_inputs().unwrap();
    let proof = Groth16::<Curve>::prove(&params, circuit, &mut rng).unwrap();
    let pvk = Groth16::<Curve>::process_vk(&params.vk).unwrap();

    let verified = Groth16::<Curve>::verify_proof(&pvk, &proof, &inputs).unwrap();
    dbg!("verified", &verified);
    assert!(verified);

    let vk_bytes = serialize_to_bytes(&params.vk);
    let public_inputs_bytes = serialize_to_bytes(&inputs);
    let proof_points_bytes = serialize_to_bytes(&proof);

    let pvk = process_vk_special(&params.vk.into());
    let result = verify_groth16(&pvk, &public_inputs_bytes, &proof_points_bytes);
    dbg!("result", &result);

    (vk_bytes, public_inputs_bytes, proof_points_bytes)
}
