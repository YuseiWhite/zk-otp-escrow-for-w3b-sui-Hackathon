"use client"

import { TransactionBlock } from "@mysten/sui.js/transactions";
import * as moveCallKiosk from '@mysten/kiosk';
import * as moveCallZKEscrow from 'src/moveCall/zk-escrow';
import { useWallet } from '@suiet/wallet-kit';
import Image from 'next/image';
import { useState } from 'react';
import { AppBar } from 'src/components/AppBar';
import { ClaimableObjectIdInput, PasscodeInput } from 'src/components/ChatInput';
import { useClaimabledObjectId, usePasscodeStore, useVerifierInputsStore } from "src/store";
import { CountdownTimer } from "src/components/CountdonwTimer";
import { SHA256 } from "crypto-js";
import { postGenerateProof } from "src/zkbuilder";

const imageUrl = "https://user-images.githubusercontent.com/14998939/256967328-b7870445-e873-416e-a1a0-ee1d60c7993c.jpg"

const ClaimScreen = () => {
  const { address, signAndExecuteTransactionBlock } = useWallet();
  const [proofIsDone, setProofIsDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { passcode } = usePasscodeStore()
  const { verifierInputs, setVerifierInputs } = useVerifierInputsStore()

  const claimableObjectId = useClaimabledObjectId((state) => state.objectId);

  return (
    <div className="text-white flex flex-col gap-[40px]">
      <div className='bg-gray-800 px-10 py-5 rounded-2xl'>
        <div className='flex items-center justify-between pb-5'>
          <span className='text-2xl text-yellow-300 font-bold '>
            Player&apos;s screen
          </span>
          <span className='text-xl text-blue-200'>
          </span>
        </div>
        <div className='flex gap-5'>
          <div className='flex-shrink-0'>
            <Image
              src={imageUrl}
              width={200}
              height={200}
              alt='my hero'
              className='bg-gray-50 rounded-lg'
            />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span className=''>
                Onetime code
              </span>
              <PasscodeInput />
            </div>
            <div className='flex items-center gap-1'>
              <span className=''>
                object id to claim
              </span>
              <ClaimableObjectIdInput />
            </div>
            <div className='flex flex-col gap-5 w-[200px]'>
              <button className={`relative text-white bg-blue-500 rounded-md px-4 py-2 max-w-120 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={async () => {
                  setIsLoading(true); // ローディング開始
                  // await sleep(3000);
                  const verifierInputs = await postGenerateProof({
                    secret_code: Array.from(Buffer.from(passcode, 'hex')),
                    public_hash: `${SHA256(passcode)}`,
                  })
                  console.log(verifierInputs)
                  setVerifierInputs(verifierInputs)
                  setProofIsDone(true);
                  setIsLoading(false); // ローディング終了
                }}
                disabled={isLoading} // ローディング中はボタンを無効化
              >
                <div className={`absolute inset-0 flex items-center justify-center ${isLoading ? '' : 'opacity-0'}`}>
                  <div className="animate-spin w-5 h-5 border-t-2 border-white rounded-full"></div>
                </div>
                <span className={`${isLoading ? 'opacity-0' : ''}`}>
                  {proofIsDone ? "proof is done" : "proof generation"}
                </span>
              </button>
              <button className="h-10 text-white text-xl bg-blue-500 rounded-md px-4 py-2 max-w-120"
                onClick={async () => {
                  if (!address) return;
                  if (!claimableObjectId) return;
                  const txb = new TransactionBlock();
                  const zero_coin = txb.moveCall({
                    target: '0x2::coin::zero',
                    typeArguments: ['0x2::sui::SUI'],
                  });
                  const [claimedAsset, transferRequest] = moveCallKiosk.purchase(
                    txb,
                    `${moveCallZKEscrow.PACKAGE_ID}::my_hero::Hero`,
                    txb.pure(moveCallZKEscrow.KIOSK_ID),
                    claimableObjectId,
                    zero_coin,
                  );
                  moveCallZKEscrow.resolveProofPolicyAndConfirmRequest({
                    txb,
                    type: `${moveCallZKEscrow.PACKAGE_ID}::my_hero::Hero`,
                    policy_id: moveCallZKEscrow.POLICY_ID,
                    transferRequest,
                    verifierInputs,
                  })
                  txb.transferObjects([claimedAsset], txb.pure(address, 'address'));

                  const result = await signAndExecuteTransactionBlock({
                    // @ts-ignore
                    transactionBlock: txb,
                  });
                  const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`;
                  console.log(url);
                }}
              >
                claim
              </button>

              <button className="h-10 text-white text-sm bg-blue-500 rounded-md px-4 py-2 max-w-120"
                onClick={async () => {
                  if (!address) return;
                  if (!claimableObjectId) return;
                  const txb = new TransactionBlock();
                  const zero_coin = txb.moveCall({
                    target: '0x2::coin::zero',
                    typeArguments: ['0x2::sui::SUI'],
                  });
                  const [claimedAsset, transferRequest] = moveCallKiosk.purchase(
                    txb,
                    `${moveCallZKEscrow.PACKAGE_ID}::my_hero::Hero`,
                    txb.pure(moveCallZKEscrow.KIOSK_ID),
                    claimableObjectId,
                    zero_coin,
                  );
                  moveCallZKEscrow.resolveProofPolicyAndConfirmRequestWithBrokenProof({
                    txb,
                    type: `${moveCallZKEscrow.PACKAGE_ID}::my_hero::Hero`,
                    policy_id: moveCallZKEscrow.POLICY_ID,
                    transferRequest,
                  })
                  txb.transferObjects([claimedAsset], txb.pure(address, 'address'));

                  const result = await signAndExecuteTransactionBlock({
                    // @ts-ignore
                    transactionBlock: txb,
                  });
                  const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`;
                  console.log(url);
                }}
              >
                claim with broken proof
              </button>

              <button className="h-10 text-white text-sm bg-blue-500 rounded-md px-4 py-2 max-w-120"
                onClick={async () => {
                  if (!address) return;
                  if (!claimableObjectId) return;
                  const txb = new TransactionBlock();
                  const zero_coin = txb.moveCall({
                    target: '0x2::coin::zero',
                    typeArguments: ['0x2::sui::SUI'],
                  });
                  const [claimedAsset, transferRequest] = moveCallKiosk.purchase(
                    txb,
                    `${moveCallZKEscrow.PACKAGE_ID}::my_hero::Hero`,
                    txb.pure(moveCallZKEscrow.KIOSK_ID),
                    claimableObjectId,
                    zero_coin,
                  );
                  moveCallZKEscrow.resolveProofPolicyAndConfirmRequestWithCorrectProof({
                    txb,
                    type: `${moveCallZKEscrow.PACKAGE_ID}::my_hero::Hero`,
                    policy_id: moveCallZKEscrow.POLICY_ID,
                    transferRequest,
                  })
                  txb.transferObjects([claimedAsset], txb.pure(address, 'address'));

                  const result = await signAndExecuteTransactionBlock({
                    // @ts-ignore
                    transactionBlock: txb,
                  });
                  const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`;
                  console.log(url);
                }}
              >
                claim with correct proof
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SecretScreen = () => (
  <div className='bg-gray-800 px-10 py-5 rounded-2xl'>
    <div className='flex items-center justify-between pb-5'>
      <span className='text-2xl text-yellow-300 font-bold '>
        Player&apos;s screen
      </span>
      <span className='text-xl text-blue-200'>
        (UI inside the game screen)
      </span>
    </div>
    <CountdownTimer totalSeconds={30} />
  </div>
);


const Page = () => {
  return (
    <div className="min-h-screen bg-yellow-900">
      <AppBar />
      <main className="flex justify-center mt-[120px]">
        <div className="text-white flex flex-col gap-[40px]">
          <ClaimScreen />
          <SecretScreen />
        </div>
      </main>
    </div>
  )
}

export default Page;
