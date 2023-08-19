"use client";

import { TransactionBlock } from "@mysten/sui.js/transactions";
import * as moveCallKiosk from '@mysten/kiosk';
import { useWallet } from '@suiet/wallet-kit';
import Image from 'next/image';
import { AppBar } from 'src/components/AppBar';
import { CountdownTimer } from 'src/components/CountdonwTimer';
import * as moveCallZKEscrow from 'src/moveCall/zk-escrow';

const imageUrl = "https://user-images.githubusercontent.com/14998939/256967328-b7870445-e873-416e-a1a0-ee1d60c7993c.jpg";

const EnterpriseScreen = () => {
  const { address, signAndExecuteTransactionBlock } = useWallet();

  return (
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
        <div className='flex flex-col gap-8'>
          <div className='flex flex-wrap gap-4'>
            <button className="h-10 text-white text-xl bg-blue-500 rounded-md px-4 py-2 max-w-120"
              onClick={async () => {
                if (!address) return;
                const txb = new TransactionBlock();
                const hero = moveCallZKEscrow.mintMyHero({
                  txb,
                  name: "My Hero",
                  imageUrl,
                  sendToAddress: address,
                });
                moveCallKiosk.placeAndList(
                  txb,
                  `${moveCallZKEscrow.PACKAGE_ID}::my_hero::Hero`,
                  txb.pure(moveCallZKEscrow.KIOSK_ID),
                  txb.pure(moveCallZKEscrow.KIOSK_CAP_ID),
                  hero,
                  BigInt(0),
                );
                const result = await signAndExecuteTransactionBlock({
                  // @ts-ignore
                  transactionBlock: txb,
                });
                const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`;
                console.log(url);
              }}
            >
              mint and list
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const PlayerScreen = () => (
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
  const { address, signAndExecuteTransactionBlock } = useWallet();

  return (
    <div className="min-h-screen bg-slate-900">
      <AppBar />
      <main className="flex justify-center mt-[120px]">
        <div className="text-white flex flex-col gap-[40px]">
          <EnterpriseScreen />
          <PlayerScreen />
        </div>
      </main>
    </div>
  )
}

export default Page;
