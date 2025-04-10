import { API_BASE_URL } from "@/lib/constants";
import { useContext } from "react";
import { TokenContext } from "@/app/admin/(dashboard)/provider";
import { stringify } from "querystring";

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
