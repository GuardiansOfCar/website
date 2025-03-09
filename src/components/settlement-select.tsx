import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SettlementSelect = () => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정산 유형" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="1">전체</SelectItem>
          <SelectItem value="1">정산</SelectItem>
          <SelectItem value="0">미정산</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
