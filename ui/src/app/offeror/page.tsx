"use client"

import { TransactionBlock } from '@mysten/sui.js';
import {
  useWallet
} from '@suiet/wallet-kit';
import { useState } from 'react';
import { AppBar } from 'src/components/AppBar';
import ChatInput from 'src/components/ChatInput';
import { moveCallDoUnlock, moveCallDoZKUnlock, moveCallMintAndTransferMyHero, moveCallOffer } from 'src/moveCall/zk-escrow';
// import { moveCallListItem, moveCallNewKiosk } from 'src/contract/moveCall';

const Page = () => {
  const { address } = useWallet();
  const [whom, setWhom] = useState<string>("");
  const [which, setWhich] = useState<string>("");
  const [howmuch, setHowmuch] = useState<string>("");

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
      <button className="text-white bg-blue-500 rounded-md px-4 py-2 max-w-120"
        onClick={async () => {
          if (!address) return

          const txb = new TransactionBlock()
          moveCallMintAndTransferMyHero({
            txb,
            name: "My Hero",
            imageUrl: "https://user-images.githubusercontent.com/14998939/256967328-b7870445-e873-416e-a1a0-ee1d60c7993c.jpg",
            sendToAddress: address,
          })

          const result = await signAndExecuteTransactionBlock({
            // @ts-ignore
            transactionBlock: txb,
          });
          console.log({ result })
          const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`
          console.log(url)
        }}
      >
        mint and transfer
      </button>

      <button className="text-white bg-blue-500 rounded-md px-4 py-2 max-w-120"
        onClick={async () => {
          if (!address) return

          const txb = new TransactionBlock()
          moveCallDoUnlock({ txb })

          const result = await signAndExecuteTransactionBlock({
            // @ts-ignore
            transactionBlock: txb,
          });
          console.log({ result })
          const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`
          console.log(url)
        }}
      >
        do unlock
      </button>

      <button className="text-white bg-blue-500 rounded-md px-4 py-2 max-w-120"
        onClick={async () => {
          if (!address) return

          const txb = new TransactionBlock()
          moveCallDoZKUnlock({ txb })

          const result = await signAndExecuteTransactionBlock({
            // @ts-ignore
            transactionBlock: txb,
          });
          console.log({ result })
          const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`
          console.log(url)
        }}
      >
        do zk unlock
      </button>

      <button className="text-white bg-blue-500 rounded-md px-4 py-2 max-w-120"
        onClick={async () => {
          if (!address) return

          const txb = new TransactionBlock()
          moveCallDoZKUnlock({ txb })

          const result = await signAndExecuteTransactionBlock({
            // @ts-ignore
            transactionBlock: txb,
          });
          console.log({ result })
          const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`
          console.log(url)
        }}
      >
        maybe Fail zk unlock
      </button>
      {/* <button className="text-white bg-blue-500 rounded-md px-4 py-2"
        onClick={async () => {
          if (!address) return
          const txb = new TransactionBlock()
          moveCallListItem({
            txb,
            senderAddress: address,
            kioskId: "0x1c4868f5e240254903df269f1ecc35162ffb596b039df5a49041c945c67af15d",
            kioskOwnerCapId: "0x600130c41b5dc01dc1b4685b7f88d88a173972d35d5ef357cdc3b8ec2938056b",
            objectIdToBeListed: '0x969271fe9cc37aa3ec8dd0ec0a2d40f654b26f71c6c47df53b6379eac2805534',
          })
          const result = await signAndExecuteTransactionBlock({
            transactionBlock: txb,
          });

          console.log({ result })
          const url = `https://suiexplorer.com/txblock/${result.digest}?network=testnet`
          console.log(url)
        }}
      >
        Offer
      </button> */}
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
