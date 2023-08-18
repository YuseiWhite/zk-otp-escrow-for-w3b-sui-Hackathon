import {
  ObjectId,
  SUI_CLOCK_OBJECT_ID,
  TransactionBlock,
} from "@mysten/sui.js";

const PACKAGE_ID =
  "0x1273499b3c68ae16efe2982707f762f7c37a6b5feaffd2998b5f39d4c5b56f85";
const PUBLISHER_ID =
  "0xb50276ec6a65f907bbbf252740d13ea64fb704d7efa26658c58fcfa197383577";

export const moveCallMintMyHero = (props: {
  txb: TransactionBlock;
  name: string;
  imageUrl: string;
  sendToAddress: string;
}) => {
  const { txb } = props;
  let hero = txb.moveCall({
    target: `${PACKAGE_ID}::my_hero::mint`,
    arguments: [
      txb.pure(props.name),
      txb.pure(props.imageUrl),
    ],
  });
  return hero;
};

export const moveCallJustDo = async (props: {
  txb: TransactionBlock;
  hero: string,
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

export const moveCallMintAndTransferMyHero = async (props: {
  txb: TransactionBlock;
  name: string;
  imageUrl: string;
  sendToAddress: string;
}) => {
  const { txb } = props;
  let hero = moveCallMintMyHero(props);
  txb.transferObjects([hero], txb.pure(props.sendToAddress));
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
