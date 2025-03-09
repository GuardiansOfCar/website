import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

export const Underkdollar = ({
  value,
  setValue,
}: {
  value: boolean;
  setValue: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox checked={value} onCheckedChange={setValue} />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        $1000 이하
      </label>
    </div>
  );
};
