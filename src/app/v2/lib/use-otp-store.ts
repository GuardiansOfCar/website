import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type OtpState = "pending" | "registered" | "unregistered";

interface OtpStore {
  state: OtpState;
  setState: (value: OtpState) => void;
}

export const useOtpStore = create<OtpStore>()(
  devtools((set) => ({
    state: "pending",
    setState: (state: OtpState) => set({ state }),
  })),
);
