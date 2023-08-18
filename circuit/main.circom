pragma circom 2.0.0;
include "node_modules/circomlib/circuits/sha256/sha256.circom";

template HashCheckWithTimeLimit() {
    signal input secretKeyword[256];
    signal input expiryTimestamp; // UNIX timestamp for expiry
    signal input currentTimestamp; // Current UNIX timestamp
    signal input publicHash[256];

    component hash = Sha256(256);

    hash.in <== secretKeyword;

    // Ensure that the hash of the secret keyword matches the public hash.
    for (var i=0; i<256; i++) {
        publicHash[i] === hash.out[i];
    }

    // Ensure that the current timestamp is before the expiry timestamp.
    assert(currentTimestamp < expiryTimestamp);
}

component main = HashCheckWithTimeLimit();
