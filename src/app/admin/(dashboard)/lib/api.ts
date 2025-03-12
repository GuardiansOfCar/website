export type BalacneSortValue = "under" | null;
export type SettlementSort = "all" | "done" | "not";
export type TypeSort = "pub" | "pri";

export interface ListRequest {
  page: number;
  limit: number;
  search: string;
  balanceSort: BalacneSortValue;
  settlementSort: SettlementSort;
  typeSort: TypeSort;
}

export const listRequest: ListRequest = {
  page: 1,
  limit: 10,
  search: "",
  balanceSort: null,
  settlementSort: "all",
  typeSort: "pub",
};

export interface ListResponse {}
