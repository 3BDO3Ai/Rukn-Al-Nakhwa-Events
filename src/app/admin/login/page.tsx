"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Login failed");
      }

      const nextPath = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("next") || "/admin"
        : "/admin";
      router.replace(nextPath);
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Login failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),_rgba(232,231,232,0.9)_35%,_rgba(232,231,232,1)_70%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-darkGreen/10 blur-3xl" />
        <div className="absolute right-[-5rem] top-32 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-darkGreen p-8 text-white shadow-[0_30px_80px_rgba(15,15,35,0.22)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-6 top-6 h-40 w-40 rounded-full border border-white/30" />
            <div className="absolute right-10 top-24 h-28 w-28 rounded-full border border-white/20" />
            <div className="absolute bottom-10 left-1/4 h-52 w-52 rounded-full border border-white/10" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-md">
                Admin Access
              </div>
              <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
                Secure login for the site management dashboard
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Use the admin password from your environment variables to access content management, uploads, and live publishing.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">Secure management access</div>
              <div className="mt-2 text-sm leading-6 text-white/80">
                Your dashboard is protected by an HttpOnly session and backed by the password in <span className="font-semibold">ADMIN_PASSWORD</span>.
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex items-center rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:p-8 lg:p-10">
          <div className="w-full">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-darkGreen/70">Authentication</p>
                <h2 className="mt-2 text-2xl font-black text-darkGreen">Sign in to continue</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-darkGreen/10 text-darkGreen shadow-sm">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 pr-14 text-sm text-slate-900 outline-none transition focus:border-darkGreen focus:ring-4 focus:ring-darkGreen/10"
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-2 my-auto flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-darkGreen"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.338.264-2.614.743-3.777M6.223 6.223A9.958 9.958 0 0012 4c5.523 0 10 4.477 10 10a9.962 9.962 0 01-2.217 6.277M3 3l18 18" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  The password is read from <span className="font-semibold text-slate-700">ADMIN_PASSWORD</span> in your environment.
                </p>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-darkGreen px-4 py-3.5 text-sm font-bold text-white transition hover:bg-darkGreen/90 hover:shadow-lg hover:shadow-darkGreen/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25a3.75 3.75 0 10-7.5 0V9M6.75 9h10.5a2.25 2.25 0 012.25 2.25v7.5A2.25 2.25 0 0117.25 21h-10.5A2.25 2.25 0 014.5 18.75v-7.5A2.25 2.25 0 016.75 9z" />
                    </svg>
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
