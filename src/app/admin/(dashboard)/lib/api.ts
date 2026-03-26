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
  start_date?: string;
  end_date?: string;
  active_time_minutes?: number;
  day_of_week?: number;
  move_method?: string;
  user_name?: string;
  sort_by?: string;
}

export const defaultDrivingHistoryRequest: DrivingHistoryListRequest = {
  page: 1,
  limit: 50,
  sort_by: "RECENT",
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

// ✅ 3. 쿠폰 조회 전용 타입 및 기본값
export interface CouponListRequest extends PaginationRequest {}

export const defaultCouponListRequest: CouponListRequest = {
  ...defaultPaginationRequest,
};

export interface CouponDetail {
  id: number;
  serial_number: string;
  condition_name: string;
  point_amount: number;
  is_active: boolean;
  is_used: boolean;
  expired_at: string;
  created_at: string;
}

export interface CouponListResponse {
  coupons: CouponDetail[];
  total: number;
}

export interface CreateCouponRequest {
  serial_number: string;
  condition_name: string;
  point_amount: number;
  expired_at: string;
}

export interface UpdateCouponRequest {
  id: number;
  condition_name?: string;
  point_amount?: number;
  expired_at?: string;
}
