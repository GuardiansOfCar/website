import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ReferralStore {
  value: string;
  setValue: (value: string) => void;
}

export const useReferralStore = create<ReferralStore>()(
  devtools(
    persist(
      (set) => ({
        value: "",
        setValue: (value: string) => set({ value }),
      }),
      {
        name: "referral-storage",
      },
    ),
  ),
);
