import {
  TransactionArgument,
  TransactionBlock,
} from "@mysten/sui.js/transactions";

// https://suiexplorer.com/txblock/Bqik3cfmFZbRr46oFjNkBen9ZNXUArKy6pGCECCJpiCb?network=testnet
export const PACKAGE_ID =
  "0x661fefd2ea8bd62959eae9f0033ab5cd4f5991f03a8053178b1f73d09e880704";

export const PUBLISHER_ID =
  "0x5dab2dd2b22eddb4ce16d92b75faa95dc691065448abc3f046131d26bd3930ba";

export const KIOSK_ID =
  "0xa6ce5e22113a513718ba15bb5e895d428244e5e8bb7fbe4a42d4c41c4b9c58a2";

export const KIOSK_CAP_ID =
  "0xbdd6f1ef21d03ee1392a599c4868822b21d7fc6e0653d51c08b41f59dc5adda9";

export const POLICY_ID =
  "0x8e12e3e952894f606f6814cd218fc0933a04ea071ab9adc544cb155d87759b0c";

export const POLICY_CAP_ID =
  "0x5b1a2e460ce2aa1aefacaff53f6bd186c8395f15460bc3e4082e4dff3d202243";

export const mintMyHero = (props: {
  txb: TransactionBlock;
  name: string;
  imageUrl: string;
  sendToAddress: string;
}) => {
  const { txb } = props;
  const hero = txb.moveCall({
    target: `${PACKAGE_ID}::my_hero::mint`,
    arguments: [
      txb.pure(props.name),
      txb.pure(props.imageUrl),
    ],
  });
  return hero;
};
export const moveCallOffer2 = async (props: {
  txb: TransactionBlock;
  hero: any;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::zk_safe::offer`,
    typeArguments: [
      `${PACKAGE_ID}::my_hero::Hero`,
    ],
    arguments: [
      txb.pure(PUBLISHER_ID),
      props.hero,
    ],
  });
};

export const attachProofPolicy = async (props: {
  txb: TransactionBlock;
  type: string;
  policy_id: string;
  policy_cap_id: string;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::proof_policy::add`,
    typeArguments: [
      props.type,
    ],
    arguments: [
      txb.pure(props.policy_id),
      txb.pure(props.policy_cap_id),
    ],
  });
};


let verifiedInputsSample = {
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



export const resolveProofPolicy = async (props: {
  txb: TransactionBlock;
  type: string;
  policy_id: string;
  transferRequest: TransactionArgument;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::proof_policy::prove`,
    typeArguments: [
      props.type,
    ],
    arguments: [
      txb.pure(props.policy_id),
      props.transferRequest,
      txb.pure(verifiedInputsSample.vk_bytes, "vector<u8>"),
      txb.pure(verifiedInputsSample.public_inputs_bytes, "vector<u8>"),
      txb.pure(verifiedInputsSample.proof_points_bytes, "vector<u8>"),
    ],
  });
};

export const resolveProofPolicyAndConfirmRequest = async (props: {
  txb: TransactionBlock;
  type: string;
  policy_id: string;
  transferRequest: TransactionArgument;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::helpers::prove_and_claim`,
    typeArguments: [
      props.type,
    ],
    arguments: [
      txb.pure(props.policy_id),
      props.transferRequest,
      txb.pure(verifiedInputsSample.vk_bytes, "vector<u8>"),
      txb.pure(verifiedInputsSample.public_inputs_bytes, "vector<u8>"),
      txb.pure(verifiedInputsSample.proof_points_bytes, "vector<u8>"),
    ],
  });

  /// SHOULD BE
  // moveCallZKEscrow.resolveProofPolicy({
  //   txb,
  //   type: `${moveCallZKEscrow.PACKAGE_ID}::my_hero::Hero`,
  //   policy_id: "0xf20628c5e1472acbf54b3c3635322922b2aec649fd77e593f245ea901d3c1d80",
  //   transferRequest,
  // })
  // moveCallKiosk.confirmRequest(
  //   txb,
  //   `${moveCallZKEscrow.PACKAGE_ID}::my_hero::Hero`,
  //   "0xf20628c5e1472acbf54b3c3635322922b2aec649fd77e593f245ea901d3c1d80", // policy_id
  //   transferRequest,
  // )
};
