"use client"

import { TransactionBlock } from '@mysten/sui.js';
import {
  useWallet
} from '@suiet/wallet-kit';
import Image from 'next/image';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AppBar } from 'src/components/AppBar';
import ChatInput from 'src/components/ChatInput';
import { CountdownTimer } from 'src/components/CountdonwTimer';
import { moveCallDoUnlock, moveCallDoZKUnlock, moveCallJustDo, moveCallMintAndTransferMyHero, moveCallMintMyHero, moveCallOffer } from 'src/moveCall/zk-escrow';
import { generateOneTimeCode, hashWithSHA256, shortenAddress } from 'src/utils/web3';
// import { moveCallListItem, moveCallNewKiosk } from 'src/contract/moveCall';

const imageUrl = "https://user-images.githubusercontent.com/14998939/256967328-b7870445-e873-416e-a1a0-ee1d60c7993c.jpg"
const notify = () => toast('Here is your toast.!');

const Page = () => {
  const { address } = useWallet();
  const [whom, setWhom] = useState<string>("");
  const [which, setWhich] = useState<string>("");
  const [howmuch, setHowmuch] = useState<string>("");

  const MainPart = () => (
    <div className="text-white flex flex-col gap-[40px]">
      <div className='bg-gray-800 px-10 py-5 rounded-2xl'>
        <div className='flex items-center justify-between pb-5'>
          <span className='text-2xl text-green-300 font-bold '>
            Enterprise&apos;s screen
          </span>
          <span className='text-xl text-blue-200'>
            (Often executed by script)
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
          <button className="h-10 text-white text-xl bg-blue-500 rounded-md px-4 py-2 max-w-120"
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
            mint and offer
          </button>
        </div>
      </div>

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

      <button className="text-white bg-blue-500 rounded-md px-4 py-2 max-w-120"
        onClick={async () => {
          if (!address) return

          const txb = new TransactionBlock()
          moveCallJustDo({
            txb,
            hero: '0x4e0695d100463932463c044554e6c6d1551ee1e252a42bf399ae2b14aa1cdd72',
          })

          const result = await signAndExecuteTransactionBlock({
            // @ts-ignore
            transactionBlock: txb,
          });
          console.log({ result })
          const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`
          console.log(url)
          notify()
        }}
      >
        just do
      </button>
    </div>
  )

  const { signAndExecuteTransactionBlock } = useWallet();

  return (
    <div className="min-h-screen bg-slate-900">
      <AppBar />
      <main className="flex justify-center mt-[120px]">
        <MainPart />
      </main>
    </div>
  )
}

export default Page;
