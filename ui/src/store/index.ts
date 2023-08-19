import { create } from "zustand";

export const usePasscodeStore = create<{
  passcode: string;
  setPasscode: (message: string) => void;

}>((set) => ({
  passcode: "",
  setPasscode: (passcode: string) => set({ passcode }),
}));


export const useClaimabledObjectId = create<{
  objectId: string;
  setObjectId: (message: string) => void;

}>((set) => ({
  objectId: "",
  setObjectId: (objectId: string) => set({ objectId }),
}));
