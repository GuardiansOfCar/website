import { PropsWithChildren, ReactNode } from "react";

export const Main = (
  props: PropsWithChildren<{
    leftHref?: string;
    rightHref?: string;
    hideNav?: boolean;
    horizontalPadding?: string;
    verticalPadding?: string;

    absoluteComponent?: ReactNode;
  }>
) => {
  const horizontalPadding = props.horizontalPadding || "px-24 max-desktop:px-5";
  const verticalPadding = props.verticalPadding || "py-20 max-desktop:py-10";

  return (
    <main
      className={`w-full max-w-[var(--max-width)] mx-auto ${verticalPadding} ${horizontalPadding} relative z-[3]`}
    >
      <div className={"relative z-[1]"}>{props.children}</div>
      {props.absoluteComponent && props.absoluteComponent}
    </main>
  );
};
