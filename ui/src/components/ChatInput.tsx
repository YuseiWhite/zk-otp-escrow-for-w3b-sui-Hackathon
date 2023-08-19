import { useClaimabledObjectId, usePasscodeStore } from 'src/store';

export const PasscodeInput = () => {
  const passcode = usePasscodeStore((state) => state.passcode);
  const setPasscode = usePasscodeStore((state) => state.setPasscode);

  const handleInputChange = (event: any) => {
    setPasscode(event.target.value);
  };

  return (
    <div className="flex items-center p-4 bg-gray-800 rounded-md">
      <input
        className="w-[200px] px-4 py-2 text-white text-3xl bg-gray-900 rounded-md focus:outline-none"
        value={passcode}
        onChange={handleInputChange}
      />
    </div>
  );
};

export const ClaimableObjectIdInput = () => {
  const passcode = useClaimabledObjectId((state) => state.objectId);
  const setPasscode = useClaimabledObjectId((state) => state.setObjectId);

  const handleInputChange = (event: any) => {
    setPasscode(event.target.value);
  };

  return (
    <div className="flex items-center p-4 bg-gray-800 rounded-md">
      <input
        className="w-[120px] px-4 py-2 text-white text-sm bg-gray-900 rounded-md focus:outline-none"
        value={passcode}
        onChange={handleInputChange}
      />
    </div>
  );
};
