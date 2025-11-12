import {PropsWithChildren, ReactNode} from "react";

export const Main = (
    props: PropsWithChildren<{
        leftHref?: string;
        rightHref?: string;
        hideNav?: boolean;
        horizontalPadding?: string;

        absoluteComponent?: ReactNode;
    }>,
) => {
    const horizontalPadding = props.horizontalPadding || "px-24 max-desktop:px-5";
    
    return (
        <main
            className={
                `w-full max-w-[var(--max-width)] mx-auto py-20 ${horizontalPadding} relative z-[3] max-desktop:py-8`
            }
        >
            <div className={"relative z-[1]"}>{props.children}</div>
            {props.absoluteComponent && props.absoluteComponent}
        </main>
    );
};
