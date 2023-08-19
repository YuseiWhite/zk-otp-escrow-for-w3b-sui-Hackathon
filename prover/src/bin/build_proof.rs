pub use ark_bn254::{Bn254 as Curve, Fr};
use serde_json::json;
use std::fs::File;
use std::io::Write;

fn print_data_info(vk_bytes: &[u8], public_inputs_bytes: &[u8], proof_points_bytes: &[u8]) {
    println!("vk_bytes size: {:?}", &vk_bytes);
    println!("public_inputs_bytes size: {:?}", &public_inputs_bytes);
    println!("proof_points_bytes size: {:?}", &proof_points_bytes);

    println!("vk_bytes: {}", hex::encode(&vk_bytes));
    println!("public_inputs_bytes: {}", hex::encode(&public_inputs_bytes));
    println!("proof_points_bytes: {}", hex::encode(&proof_points_bytes));
}

fn save_data_to_json(vk_bytes: &[u8], public_inputs_bytes: &[u8], proof_points_bytes: &[u8]) {
    let output_data = json!({
        "vk_bytes": &vk_bytes,
        "public_inputs_bytes": &public_inputs_bytes,
        "proof_points_bytes": &proof_points_bytes,
    });

    let mut file = File::create("output_data.json").expect("Unable to create file");
    file.write_all(output_data.to_string().as_bytes())
        .expect("Unable to write data");
}

fn main() {
    let (vk_bytes, public_inputs_bytes, proof_points_bytes) =
        prover::groth16::verify_proof_with_r1cs(
            prover::helpers::load_public_inputs_from_file("prover_inputs.json"),
            "../circuit/main_js/main.wasm",
            "../circuit/main.r1cs",
        );

    print_data_info(&vk_bytes, &public_inputs_bytes, &proof_points_bytes);
    save_data_to_json(&vk_bytes, &public_inputs_bytes, &proof_points_bytes);
}
