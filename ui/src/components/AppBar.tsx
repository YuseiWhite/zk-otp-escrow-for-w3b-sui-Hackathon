import {
  ConnectButton
} from '@suiet/wallet-kit';
import Link from 'next/link';

/**
 * WalletConnectButton コンポーネント
 * @returns
 */
const WalletConnectButton = () => {
  return (
    <ConnectButton>Connect Wallet</ConnectButton>
  );
};


export const AppBar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-green-800 shadow-md">
      <div className="font-bold text-4xl text-white">
        ZK-OTP Escrow
      </div>
      <div className="flex items-center gap-6">
        <Link href="/offer">
          <span className="text-lg text-white hover:text-gray-300 transition duration-300">
            /offer
          </span>
        </Link>
        <Link href="/claim">
          <span className="text-lg text-white hover:text-gray-300 transition duration-300">
            /claim
          </span>
        </Link>
        {/* <div className="font-bold text-lg">
          <button className="rounded-xl bg-slate-200 py-2 px-4 hover:bg-slate-300 transition duration-300"
            onClick={async () => {
              const auth = getAuth(firebaseApp);
              console.log(auth.currentUser)
              console.log(auth2.currentUser)
            }}
          >
            dbg
          </button>
        </div> */}
        <div className="font-bold text-lg">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  )
}
