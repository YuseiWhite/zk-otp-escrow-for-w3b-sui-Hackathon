import {
  ConnectButton
} from '@suiet/wallet-kit';

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
    <div className="flex items-center justify-between px-3 py-2">
      <div className="font-bold text-4xl mb-4 text-white">
        Do you offer
      </div>
      <div className="flex items-center gap-5">
        {/* <div className="font-bold text-lg mb-4">
          <button className="rounded-xl bg-slate-200 py-2 px-3"
            onClick={async () => {
              const auth = getAuth(firebaseApp);
              console.log(auth.currentUser)
              console.log(auth2.currentUser)
            }}
          >
            dbg
          </button>
        </div> */}
        <div className="font-bold text-lg mb-4">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  )
}
