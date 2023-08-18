use serde_json::json;
use sha2::{Digest, Sha256};
use std::fs;

fn main() {
    // 1. Get a 6-digit secret code
    let secret_code: u32 = 123456; // Example 6-digit number. In reality, you'd get this from somewhere else.

    // 2. Convert secret code to bytes and hash it with SHA-256
    let secret_code_bytes = secret_code.to_be_bytes(); // Convert integer to bytes
    let hash_result = Sha256::digest(&secret_code_bytes);

    // Convert the first 16 bytes of the hash to a 128-bit number
    let mut public_hash_value = 0u128;
    for byte in hash_result.iter().take(16) {
        public_hash_value = (public_hash_value << 8) | *byte as u128;
    }

    // 3. Get the expiry and current timestamps
    let expiry_time = (chrono::Utc::now().timestamp() + 86400) as u64; // +1 day from now
    let current_time = chrono::Utc::now().timestamp() as u64;

    // 4. Save all values to prover_inputs.json
    let prover_data = json!({
        "secretCode": secret_code.to_string(),
        "publicHash": public_hash_value.to_string(),
        "expiryTimestamp": expiry_time.to_string(),
        "currentTimestamp": current_time.to_string()
    });

    fs::write(
        "prover_inputs.json",
        serde_json::to_string_pretty(&prover_data).unwrap(),
    )
    .unwrap();
}
