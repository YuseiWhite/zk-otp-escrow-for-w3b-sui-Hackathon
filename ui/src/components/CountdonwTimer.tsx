import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { generateOneTimeCode, hashWithSHA256 } from 'src/utils/web3';

export const CountdownTimer = (props: {
  totalSeconds: number;
}) => {
  const [seconds, setSeconds] = useState(props.totalSeconds);
  const [code, setCode] = useState(generateOneTimeCode());
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = ((seconds / props.totalSeconds) * circumference) - circumference;

  useEffect(() => {
    if (seconds === 0) {
      setCode(generateOneTimeCode()); // 30秒経過したら新しいコードを生成
      setSeconds(props.totalSeconds); // タイマーをリセット
      return;
    }

    const timerId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [seconds]);

  return (
    <div>
      <div className="countdown-timer flex -items-items-center gap-5">
        <div className="one-time-code flex items-center gap-3">
          One Time Code (private input):
          <span className='text-3xl'>
            {code}
          </span>
        </div>
        <svg width="100" height="100" className="timer-svg">
          <circle
            r={radius}
            cx="50"
            cy="50"
            fill="none"
            stroke="lightgray"
            strokeWidth="10"
          />
          <circle
            r={radius}
            cx="50"
            cy="50"
            fill="none"
            stroke="red"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
      </div>
      <div>
        public hash: {hashWithSHA256(code)}
      </div>
    </div>
  );
}
