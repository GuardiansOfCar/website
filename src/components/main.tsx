import {PropsWithChildren, ReactNode} from "react";

export const Main = (
    props: PropsWithChildren<{
        leftHref?: string;
        rightHref?: string;
        hideNav?: boolean;

        absoluteComponent?: ReactNode;
    }>,
) => {
    return (
        <main
            className={
                "w-full max-w-[var(--max-width)] mx-auto py-20 px-24 relative z-[3] max-desktop:py-8 max-desktop:px-5"
            }
        >
            <div className={"relative z-[1]"}>{props.children}</div>
            {props.absoluteComponent && props.absoluteComponent}
        </main>
    );
};
