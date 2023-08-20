import {
  Connection,
  Ed25519Keypair,
  fromB64,
  JsonRpcProvider,
  RawSigner,
  TransactionBlock,
} from "@mysten/sui.js";
import fs from "fs";

globalThis.fetch = fetch;

const loadLocalJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error("Error loading local JSON file:", error);
    return null;
  }
};

const getKeypair = () => {
  const privatekey0x = process.env.SUI_PRIVATE_KEY as string;
  const privatekey = privatekey0x.replace(/^0x/, "");
  const privateKeyBase64 = Buffer.from(privatekey, "hex").toString("base64");
  return Ed25519Keypair.fromSecretKey(fromB64(privateKeyBase64));
};

let vefifiedInputsSample = {
 vk_bytes: [ 84, 150, 13, 20, 250, 162, 123, 244, 216, 37, 221, 3, 48, 17, 76, 221, 32, 72, 233, 238,
  171, 185, 247, 25, 61, 13, 184, 224, 31, 185, 214, 152, 223, 73, 129, 222, 160, 76, 17, 48, 97, 247,
  89, 252, 28, 114, 175, 32, 141, 118, 18, 29, 189, 227, 126, 56, 111, 193, 90, 3, 213, 219, 218, 29,
  117, 198, 106, 78, 136, 179, 11, 149, 171, 221, 179, 52, 61, 118, 231, 96, 110, 165, 248, 72, 123,
  62, 239, 36, 97, 124, 2, 13, 12, 5, 142, 158, 39, 152, 176, 55, 67, 11, 211, 21, 253, 145, 188, 172,
  49, 25, 163, 188, 194, 232, 184, 45, 6, 179, 117, 126, 141, 191, 119, 52, 226, 200, 29, 19, 213, 0,
  140, 107, 242, 241, 31, 250, 126, 42, 141, 99, 213, 14, 114, 99, 148, 184, 141, 220, 43, 147, 73,
  135, 155, 132, 47, 87, 133, 31, 248, 147, 22, 81, 192, 2, 21, 142, 113, 222, 14, 121, 144, 211, 85,
  226, 117, 157, 180, 127, 65, 209, 57, 156, 202, 40, 113, 145, 2, 93, 104, 96, 228, 37, 182, 206, 83,
  247, 135, 4, 228, 226, 9, 131, 67, 85, 180, 123, 83, 38, 148, 58, 42, 14, 170, 88, 178, 142, 21, 193,
  120, 41, 91, 213, 211, 135, 2, 0, 0, 0, 0, 0, 0, 0, 202, 57, 12, 163, 240, 200, 185, 29, 2, 182, 168,
  134, 195, 217, 183, 189, 98, 89, 82, 207, 6, 13, 177, 239, 84, 68, 177, 136, 162, 193, 224, 161, 146,
  81, 156, 150, 208, 40, 133, 241, 204, 26, 58, 97, 64, 0, 1, 119, 125, 195, 88, 10, 34, 80, 69, 37, 157,
  28, 135, 242, 59, 161, 131, 7 ],
public_inputs_bytes: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0 ],
proof_points_bytes: [ 119, 82, 143, 34, 206, 152, 240, 112, 162, 132, 141, 152, 66, 235, 15, 97,
  13, 86, 219, 180, 24, 242, 52, 22, 66, 171, 99, 151, 120, 26, 27, 8, 114, 92, 253, 196, 157, 15, 255,
  210, 160, 232, 183, 40, 35, 98, 58, 38, 115, 84, 199, 2, 135, 123, 218, 210, 219, 216, 111, 243, 94,
  130, 239, 0, 21, 140, 2, 7, 93, 42, 37, 106, 236, 215, 170, 169, 93, 24, 158, 111, 69, 215, 192, 188,
  12, 172, 145, 183, 69, 184, 7, 61, 165, 255, 255, 47, 13, 36, 216, 110, 95, 14, 250, 225, 225, 189,
  49, 111, 252, 211, 230, 233, 163, 237, 206, 225, 122, 90, 170, 226, 120, 145, 251, 194, 131, 77,
  124, 21 ]
}



const setupTransactionBlock = (vk_bytes, public_inputs_bytes, proof_points_bytes) => {
  const pkgID = "0xd0cb8699235e0785e6aba7b19e1065efbd359eea0ed702dc68228ecbda3de3e0"
  let txb = new TransactionBlock();
  txb.moveCall({
    target: `${pkgID}::verifier::verify_proof`,
    typeArguments: [],
    arguments: [
      txb.pure(vk_bytes, "vector<u8>"),
      txb.pure(public_inputs_bytes, "vector<u8>"),
      txb.pure(proof_points_bytes, "vector<u8>"),
    ],
  });
  return txb;
};

const main = async () => {
  const localData = loadLocalJSON('../prover/output_data.json');
  if (!localData) return;

  const { vk_bytes, public_inputs_bytes, proof_points_bytes } = localData;
  console.log({ vk_bytes, public_inputs_bytes, proof_points_bytes })

  const provider = new JsonRpcProvider(
    new Connection({
      fullnode: "https://sui-testnet.nodeinfra.com",
    }),
  );

  const signer = new RawSigner(getKeypair(), provider);
  const address = await signer.getAddress();
  console.log({ address });

  const txb = setupTransactionBlock(vk_bytes, public_inputs_bytes, proof_points_bytes);
  const dryRunResult = await signer.dryRunTransactionBlock({
    transactionBlock: txb,
  });

  console.log(dryRunResult);

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: txb,
  });
  console.log(result);

  console.log("hello");
};

main();
