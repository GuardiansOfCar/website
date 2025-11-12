import { Checkbox } from "@/app/v2/components/ui/checkbox";
import { BalacneSortValue } from "@/app/admin/(dashboard)/lib/api";

export const Underkdollar = ({
  value,
  setValue,
}: {
  value: BalacneSortValue;
  setValue: (value: BalacneSortValue) => void;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={value === "under"}
        onCheckedChange={(a) => setValue(a ? "under" : null)}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        $1000 이하
      </label>
    </div>
  );
};
