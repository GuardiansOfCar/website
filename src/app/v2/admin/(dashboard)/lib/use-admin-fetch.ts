import { API_BASE_URL } from "@/app/v2/lib/constants";
import { useContext } from "react";
import { TokenContext } from "@/app/admin/(dashboard)/provider";
import { stringify } from "querystring";
import { logout } from "@/app/actions/auth";

export function useAdminFetch() {
  const token = useContext(TokenContext);
  return async (
    path: string,
    options?: {
      query?: NodeJS.Dict<any>;
      data?: object;
      method?: "POST" | "PUT" | "GET" | "PATCH" | "DELETE";
    },
  ) => {
    const { query, data, method = "GET" } = options ?? {};

    const res = await fetch(
      `${API_BASE_URL}${path}${query ? "?" + stringify(query) : ""}`,
      {
        body:
          method !== "GET" && method !== "DELETE"
            ? JSON.stringify(data || {})
            : undefined,
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      },
    );

    // 401 에러 발생 시 자동 로그아웃 처리
    if (res.status === 401) {
      await logout();
      return;
    }

    if (res.status >= 400) {
      throw await res.json();
    }

    try {
      return await res.json();
    } catch (err: unknown) {
      return null;
    }
  };
}
