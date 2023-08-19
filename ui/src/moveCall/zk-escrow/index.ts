import {
  TransactionArgument,
  TransactionBlock,
} from "@mysten/sui.js/transactions";

// https://suiexplorer.com/txblock/8ug1rV4zypigeKSaQK6Mz1rrcBnCx6oHFKmvcdxeJZ2s?network=testnet

export const PACKAGE_ID =
  "0xa1b10342d0aec5076d7e7437cf7071fc84091b8b4d147c6ee594fb22c7d08547";
export const PUBLISHER_ID =
  "0x7a6fd679e68167cd33d0c798d747f5bf46127baa3ace156770e4bd52f9edc1e3";

export const TARGET_ASSET_ID =
  "0xaa28c4a2598c4801603ab3dd452766dcad201035d2bf53f2706d72341d7c3686";

export const KIOSK_ID =
  "0x7a3461e83d78bcf2bfb7d489605e6c00e39702dfb555045853dc1e6951d4aeae";

export const KIOSK_CAP_ID =
  "0xc16699d0c4f1424832f9f951647599401693cfe3f9d7f29160b5c5cc75f88c91";

export const POLICY_ID =
  "0xb705b1f189a94acc0da55ec1507d4c2ab116ffe8bf470c8e968cdfc5d6112d66";

export const POLICY_CAP_ID =
  "0x45a2a10faf811e62da9e36bf78ed84cb7399646c8024028963744f8c4a4adba8";

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
      txb.pure([], "vector<u8>"), // vk_bytes
      txb.pure([], "vector<u8>"), // public_inputs_bytes
      txb.pure([], "vector<u8>"), // proof_bytes
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

export const moveCallZKOffer = async (props: {
  txb: TransactionBlock;
  hero: string;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::zk_safe::offer`,
    typeArguments: [
      `${PACKAGE_ID}::my_hero::Hero`,
    ],
    arguments: [
      txb.pure(PUBLISHER_ID),
      txb.pure(props.hero),
    ],
  });
};

export const moveCallJustDo = async (props: {
  txb: TransactionBlock;
  hero: string;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::zk_safe::just_do`,
    typeArguments: [
      `${PACKAGE_ID}::my_hero::Hero`,
    ],
    arguments: [
      txb.pure(PUBLISHER_ID),
      txb.pure(props.hero),
    ],
  });
};

export const moveCallOffer = async (props: {
  txb: TransactionBlock;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::offer::offer`,
  });
};

export const moveCallDoUnlock = async (props: {
  txb: TransactionBlock;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::unlock::do_unlock`,
    typeArguments: [
      `${PACKAGE_ID}::utils::Asset`,
    ],
    arguments: [
      txb.pure(PUBLISHER_ID),
    ],
  });
};

export const moveCallDoZKUnlock = async (props: {
  txb: TransactionBlock;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::zk_unlock::do_unlock`,
    typeArguments: [
      `${PACKAGE_ID}::utils::Asset`,
    ],
    arguments: [
      txb.pure(PUBLISHER_ID),
    ],
  });
};

// export const moveCallDoUnlock = async (props: {
//   txb: TransactionBlock;
// }) => {
//   const { txb } = props;
//   let [kiosk, kioskOwnerCap] = txb.moveCall({
//     target: "0x2::kiosk::new",
//   });
//   let [policy, policyCap] = txb.moveCall({
//     target: "0x2::transfer_policy::new",
//     typeArguments: [

//     ],
//     arguments: [
//       txb.pure(PUBLISHER_ID),
//     ],
//   });
//   let unlocker = txb.moveCall({
//     target: `${PACKAGE_ID}::unlock::new_unlock`,
//     typeArguments: [
//       `${PACKAGE_ID}::my_hero::Hero`,
//     ],
//   });
//   let asset = txb.moveCall({
//     target: `${PACKAGE_ID}::unlock::unlock`,
//     arguments: [
//       txb.pure(PUBLISHER_ID),
//     ],
//   });

//   let asset = unlock(&unlocker, &mut kiosk, &kiosk_cap, asset_id, ctx);

// };

export const moveCallUnlock = async (props: {
  txb: TransactionBlock;
}) => {
  const { txb } = props;
  txb.moveCall({
    target: `${PACKAGE_ID}::offer::offer`,
  });
};
