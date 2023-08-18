import {
  ObjectId,
  SUI_CLOCK_OBJECT_ID,
  TransactionBlock,
} from "@mysten/sui.js";

const PACKAGE_ID =
  "0xa0f6b1c72edf19967c91404c525b39746001feb5b8a0d61f76446ca718d2768a";
const PUBLISHER_ID =
  "0xaaf11dc86d49ebc1e8bb5ce4f39491beb2ad9eba09b9f042ad6d56ccb34624b8";

export const moveCallMintAndTransferMyHero = async (props: {
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
