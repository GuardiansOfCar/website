import { PropsWithChildren } from "react";
import Image from "next/image";

export const Checkbox = (
  props: PropsWithChildren<{
    checked?: boolean;
  }>,
) => {
  return (
    <div className={"text-body-3 flex items-center space-x-2 cursor-pointer"}>
      <Image
        src={props.checked ? "/images/checked.png" : "/images/unchecked.png"}
        alt={"cjhecked"}
        width={20}
        height={20}
      />
      <label>{props.children}</label>
    </div>
  );
};
