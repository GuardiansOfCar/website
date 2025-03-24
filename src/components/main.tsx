import { PropsWithChildren } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export const Main = (
  props: PropsWithChildren<{
    leftHref: string;
    rightHref: string;
  }>,
) => {
  const icon = (
    <Image
      width={70}
      height={80}
      src={
        props.leftHref
          ? "/images/page-left.png"
          : "/images/page-left-disabled.png"
      }
      alt={"left"}
    />
  );
  const ricon = (
    <Image
      width={70}
      height={80}
      src={
        props.rightHref
          ? "/images/page-right.png"
          : "/images/page-right-disabled.png"
      }
      alt={"right"}
    />
  );

  return (
    <main
      className={
        "w-full max-w-[var(--max-width)] mx-auto py-20 px-24 relative z-[3] max-desktop:py-8 max-desktop:px-5"
      }
    >
      <div
        className={
          "fixed top-1/2 -translate-y-1/2 left-0 z-10 max-laptop:hidden max-desktop:!left-0"
        }
        style={{
          left: "calc((100vw - 1440px) / 2 - 40px)",
        }}
      >
        {props.leftHref ? <Link href={props.leftHref}>{icon}</Link> : icon}
      </div>

      <div className={"relative z-[1]"}>{props.children}</div>

      <div
        className="fixed top-1/2 right-0 z-10 -translate-y-1/2 max-laptop:hidden max-desktop:!right-0"
        style={{ right: "calc((100vw - 1440px) / 2 - 40px)" }}
      >
        {props.rightHref ? <Link href={props.rightHref}>{ricon}</Link> : ricon}
      </div>
    </main>
  );
};
