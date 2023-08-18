use sha2::{Digest, Sha256};
use std::convert::TryInto;

fn check_with_time_limit(
    secret_code: u128,
    expiry_timestamp: i64,
    current_timestamp: i64,
    public_hash: u128,
) -> bool {
    // Ensure that the current timestamp is before the expiry timestamp.
    if current_timestamp >= expiry_timestamp {
        return false;
    }

    // Convert secretCode to bytes
    let secret_code_bytes: [u8; 16] = secret_code.to_be_bytes();

    // Hash the secretCode bytes with SHA-256
    let hash_result = Sha256::digest(&secret_code_bytes);

    // Convert the first 16 bytes of the hash to a 128-bit number
    let hash_as_number: u128 = u128::from_be_bytes(hash_result[0..16].try_into().unwrap());

    // Ensure that the hash of the secretCode matches the publicHash.
    public_hash == hash_as_number
}

fn main() {
    let secret_code: u128 = 123456; // This is just an example, and would typically be much larger.
    let expiry_time = 1677609273; // Example UNIX timestamp for expiry.
    let current_time = 1677500000; // Example current UNIX timestamp.
    let public_hash: u128 = 457522951552364352399215799142075475; // Example hash value.

    let result = check_with_time_limit(secret_code, expiry_time, current_time, public_hash);
    println!("The result is: {}", result);
}
