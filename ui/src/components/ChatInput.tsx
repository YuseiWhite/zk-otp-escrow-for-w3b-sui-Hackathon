
import { TransactionBlock } from '@mysten/sui.js';
import { useWallet } from '@suiet/wallet-kit';
import { useState } from 'react';

/**
 * ChatInput コンポーネント
 * @returns
 */
const ChatInput = () => {
  const { signAndExecuteTransactionBlock } = useWallet();

  const [message, setMessage] = useState("");

  const handleInputChange = (event: any) => {
    setMessage(event.target.value);
  };


  return (
    <div className="flex items-center p-4 bg-gray-800 rounded-md">
      <input
        className="w-[200px] px-4 py-2 text-white text-3xl bg-gray-900 rounded-md focus:outline-none"
        // placeholder="Please enter messege..."
        value={message}
        onChange={handleInputChange}
      />
      {/* <button
        className="ml-4 text-white bg-blue-500 rounded-md px-4 py-2"
        onClick={async (event: any) => {
        }}
      >
        Send
      </button> */}
    </div>
  );
};

export default ChatInput;
