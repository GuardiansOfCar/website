"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Popup } from "@/components/popup";
import { Button } from "@/components/button";
import clsx from "clsx";

interface OtpForm {
  otpCode: string;
}

export const OtpPopup = ({
  onClose,
  onEnter,
}: {
  onClose: () => void;
  onEnter: (data: string) => void;
}) => {
  const form = useForm<OtpForm>({ defaultValues: { otpCode: "" } });

  const onSubmit = async (data: OtpForm) => {
    if (!data.otpCode)
      return alert("Please enter your valid OTP code with 6 digits.");

    onEnter(data.otpCode);
  };

  const t = useTranslations();
  const code = form.watch("otpCode");

  return (
    <Popup onClose={onClose} title={t("otp.t4")}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={"flex flex-col space-y-3"}>
          <p className={"text-center"}>{t("otp.t1")}</p>

          <input
            {...form.register("otpCode")}
            type={"number"}
            maxLength={6}
            className={"py-3 px-2 bg-[#CDE7E5] text-body-2 rounded-none"}
          />

          <Button disabled={!code} className={clsx("disabled:bg-neutral-30")}>
            {t("common.submit")}
          </Button>

          <div
            className={"flex flex-col items-center text-body-3  space-y-1 py-4"}
          >
            <p>{t("otp.t2")}</p>
            <p>{t("otp.t3")}</p>
          </div>
        </div>
      </form>
    </Popup>
  );
};
