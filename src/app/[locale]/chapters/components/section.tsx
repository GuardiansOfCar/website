import { ReactNode } from "react";

export const ChaptersSection = ({
  title,
  children,
  section,
}: {
  section: string;
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className={"flex flex-col space-y-4"}>
      <h2 className={"text-header-2 text-primary"}>{section}</h2>
      <section className={"w-[400px] border-primary-0 border-4"}>
        <div className={"border-primary-0 border-b-4 px-3 py-4 bg-primary-90"}>
          <p className={"text-body-1b "}>{title}</p>
        </div>
        <div className={"bg-neutral-100 text-body-3 px-4 py-5"}>{children}</div>
      </section>
    </div>
  );
};
