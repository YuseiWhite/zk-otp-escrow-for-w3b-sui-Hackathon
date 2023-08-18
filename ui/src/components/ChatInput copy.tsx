
import { TransactionBlock } from '@mysten/sui.js';
import { useWallet } from '@suiet/wallet-kit';
import { Dispatch, SetStateAction, useState } from 'react';

/**
 * ChatInput コンポーネント
 * @returns
 */
const ChatInput = (props: {
  text: string,
  setText: Dispatch<SetStateAction<string>>
}) => {

  const handleInputChange = (event: any) => {
    props.setText(event.target.value);
  };


  return (
    <div className="flex items-center p-4 bg-gray-800 rounded-md">
      <input
        className="w-full px-4 py-2 text-white bg-gray-900 rounded-md focus:outline-none"
        placeholder="Please enter messege..."
        value={props.text}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default ChatInput;
