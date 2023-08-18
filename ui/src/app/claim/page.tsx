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
import { generateOneTimeCode, hashWithSHA256, shortenAddress } from 'src/utils/web3';
// import { moveCallListItem, moveCallNewKiosk } from 'src/contract/moveCall';

const imageUrl = "https://user-images.githubusercontent.com/14998939/256967328-b7870445-e873-416e-a1a0-ee1d60c7993c.jpg"

const Page = () => {
  const { address } = useWallet();
  const [whom, setWhom] = useState<string>("");
  const [which, setWhich] = useState<string>("");
  const [howmuch, setHowmuch] = useState<string>("");

  let onetimeCode = generateOneTimeCode()

  const partList = [
    {
      label: "To whom?",
      annotation: 'Google mail address: name@gmail.com',
      text: whom,
      setText: setWhom,
    },
    {
      label: "Which object?",
      annotation: 'object Id',
      text: which,
      setText: setWhich,
    },
    {
      label: "How much?",
      annotation: 'SUI',
      text: howmuch,
      setText: setHowmuch,
    },
  ]

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
