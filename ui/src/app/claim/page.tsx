"use client"

import { TransactionBlock } from '@mysten/sui.js';
import {
  useWallet
} from '@suiet/wallet-kit';
import Image from 'next/image';
import { useState } from 'react';
import { AppBar } from 'src/components/AppBar';
import ChatInput from 'src/components/ChatInput';
import { moveCallDoUnlock, moveCallDoZKUnlock, moveCallJustDo, moveCallMintAndTransferMyHero, moveCallMintMyHero, moveCallOffer } from 'src/moveCall/zk-escrow';
import { sleep } from 'src/utils';
import { generateOneTimeCode, hashWithSHA256, shortenAddress } from 'src/utils/web3';
// import { moveCallListItem, moveCallNewKiosk } from 'src/contract/moveCall';

const imageUrl = "https://user-images.githubusercontent.com/14998939/256967328-b7870445-e873-416e-a1a0-ee1d60c7993c.jpg"

const Page = () => {
  const { address } = useWallet();
  const [proofIsDone, setProofIsDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const MainPart = () => (
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
          <Image
            src={imageUrl}
            width={200}
            height={200}
            alt='my hero'
            className='bg-gray-50 rounded-lg'
          />
          <div>
            <div className='flex items-center gap-2'>
              <span className=''>
                Onetime code
              </span>
              <ChatInput />
            </div>
            <div className='flex flex-col gap-5 w-[200px]'>
              <button className={`relative text-white bg-blue-500 rounded-md px-4 py-2 max-w-120 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={async () => {
                  setIsLoading(true); // ローディング開始
                  await sleep(3000);
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
              <button className="text-white bg-blue-500 rounded-md px-4 py-2 max-w-120"
                onClick={async () => {
                  if (!address) return

                  const txb = new TransactionBlock()
                  let hero = moveCallMintMyHero({
                    txb,
                    name: "My Hero",
                    imageUrl,
                    sendToAddress: address,
                  })
                  txb.transferObjects([hero], txb.pure(address));
                  // moveCallJustDo({
                  //   txb,
                  //   hero,
                  // })

                  const result = await signAndExecuteTransactionBlock({
                    // @ts-ignore
                    transactionBlock: txb,
                  });
                  console.log({ result })
                  const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`
                  console.log(url)
                }}
              >
                claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const { signAndExecuteTransactionBlock } = useWallet();

  return (
    <div className="min-h-screen bg-yellow-900">
      <AppBar />
      <main className="flex justify-center mt-[120px]">
        <MainPart />
      </main>
    </div>
  )
}

export default Page;
