"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Main } from "@/components/main";
import { Button } from "@/components/button";
import { API_BASE_URL } from "@/lib/constants";
import clsx from "clsx";

interface LoginFormData {
  emailAddress: string;
  password: string;
}

// Generate or retrieve device_id
function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  
  const stored = localStorage.getItem("device_id");
  if (stored) return stored;
  
  // Generate a simple device ID
  const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem("device_id", deviceId);
  return deviceId;
}

export default function DeleteAccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loginForm = useForm<LoginFormData>({
    defaultValues: { emailAddress: "", password: "" },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const deviceId = getDeviceId();
      const res = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          emailAddress: data.emailAddress,
          password: data.password,
          device_id: deviceId,
        }),
      });

      if (res.status >= 300) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      const payload = await res.json();
      if (payload.access_token) {
        setToken(payload.access_token);
        setIsLoggedIn(true);
        setError(null);
      } else {
        setError("Login failed. No access token received.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) {
      setError("Please login first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/v1/user/delete-account`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          reason: "I don't want to use this service anymore.",
          select_index: 1,
        }),
      });

      if (res.status >= 300) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Failed to delete account. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError("An error occurred during account deletion. Please try again.");
      console.error("Delete account error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className={"bg-hero"}>
      <Main hideNav rightHref={""} leftHref={""}>
        <div className={"bg-white w-full mx-auto max-w-md p-8 border-black border-4"}>
          <h1 className={"text-2xl font-bold mb-6 text-center"}>
            Account Deletion
          </h1>

          {success ? (
            <div className={"flex flex-col items-center space-y-4"}>
              <div className={"text-green-600 font-semibold text-center"}>
                Your account has been successfully deleted.
              </div>
            </div>
          ) : !isLoggedIn ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <div className={"flex flex-col space-y-4"}>
                <div className={"text-center mb-4"}>
                  <p>Please login to delete your account.</p>
                </div>

                {error && (
                  <div className={"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"}>
                    {error}
                  </div>
                )}

                <div className={"flex flex-col space-y-2"}>
                  <label htmlFor="emailAddress" className={"font-semibold"}>
                    Email Address
                  </label>
                  <input
                    {...loginForm.register("emailAddress", { required: true })}
                    type="email"
                    id="emailAddress"
                    className={"py-3 px-4 bg-[#CDE7E5] text-body-2 rounded-none border-black border-2"}
                    placeholder="Enter your email"
                  />
                </div>

                <div className={"flex flex-col space-y-2"}>
                  <label htmlFor="password" className={"font-semibold"}>
                    Password
                  </label>
                  <input
                    {...loginForm.register("password", { required: true })}
                    type="password"
                    id="password"
                    className={"py-3 px-4 bg-[#CDE7E5] text-body-2 rounded-none border-black border-2"}
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={clsx("w-full", isLoading && "opacity-50")}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          ) : (
            <div className={"flex flex-col space-y-4"}>
              <div className={"text-center mb-4"}>
                <p className={"font-semibold mb-2"}>
                  Are you sure you want to delete your account?
                </p>
                <p className={"text-sm text-gray-600"}>
                  This action cannot be undone.
                </p>
              </div>

              {error && (
                <div className={"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"}>
                  {error}
                </div>
              )}

              <div className={"flex flex-col space-y-2 pt-2"}>
                <Button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className={clsx("w-full bg-red-600", isLoading && "opacity-50")}
                >
                  {isLoading ? "Deleting Account..." : "Delete My Account"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsLoggedIn(false)}
                  className={"w-full !bg-neutral-40"}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Main>
    </div>
  );
}

