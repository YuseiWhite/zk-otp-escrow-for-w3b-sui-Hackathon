import React from 'react';
import { ConnectButton } from '@suiet/wallet-kit';
import Link from 'next/link';

const NavLink: React.FC<{
  href: string
  children: React.ReactNode,
}> = ({ href, children }) => {
  // const router = useRouter();
  // const isActive = router.pathname === href;

  const isActive = false;

  return (
    <Link href={href}>
      <span
        className={`text-lg ${isActive ? 'text-gray-300' : 'text-white'} hover:text-gray-300 transition duration-300`}
      >
        {children}
      </span>
    </Link>
  );
};

const WalletConnectButton: React.FC = () => {
  return <ConnectButton>Connect Wallet</ConnectButton>;
};

export const AppBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-green-800 shadow-md">
      <div className="font-bold text-4xl text-white">ZK-OTP Escrow</div>
      <div className="flex items-center gap-6">
        <NavLink href="/offer">/offer</NavLink>
        <NavLink href="/claim">/claim</NavLink>
        <NavLink href="/admin">/admin</NavLink>
        <div className="font-bold text-lg">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
};
