export type BalacneSortValue = "under" | null;
export type SettlementSort = "all" | "done" | "not";
export type TypeSort = "pub" | "pri";

export interface PaginationRequest {
  page: number;
  limit: number;
  search?: string;
}

export const defaultPaginationRequest: PaginationRequest = {
  page: 1,
  limit: 10,
};

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

// ✅ 1. 이동 기록 조회 전용 타입 및 기본값
export interface DrivingHistoryListRequest extends PaginationRequest {
  startDate?: string;
  endDate?: string;
  time?: string;
  day?: string;
  type?: string;
  name?: string;
  sort?: string;
}

export const defaultDrivingHistoryRequest: DrivingHistoryListRequest = {
  ...defaultPaginationRequest, // 공통 기본값 포함
  sort: "LATEST",
};

// ✅ 2. 공지사항 조회 전용 타입 및 기본값
export interface NoticeListRequest extends PaginationRequest {
  start_date?: string;
  end_date?: string;
  type?: "ALL" | "EVENT" | "ANNOUNCEMENT";
  importance_type?: "ALL" | "IMPORTANT" | "NORMAL";
  query?: string;
  order_by?: "RECENT" | "OLDEST";
}

export const defaultNoticeListRequest: NoticeListRequest = {
  ...defaultPaginationRequest,
  type: "ALL",
  importance_type: "ALL",
  order_by: "RECENT",
};