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
        value: "gotcar", // 기본값을 gotcar로 설정
        setValue: (value: string) => set({ value }),
      }),
      {
        name: 'referral-storage', // localStorage에 저장될 키 이름
      }
    )
  )
);
