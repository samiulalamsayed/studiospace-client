"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Aperture,
    ArrowRight,
    Eye,
    EyeOff,
    LoaderCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { error } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password.");
                return;
            }

            // Better Auth থেকে JWT সংগ্রহ
            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                toast.error("Unable to generate authentication token.");
                return;
            }

            // Express server-এ HTTPOnly Cookie সেট
            const response = await fetch("https://studiospace-server-sayed-cbee.vercel.app/api/auth/set-cookie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    token: tokenData.token,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to establish server authentication.");
            }

            toast.success("Welcome back! Login successful.");

            const requestedURL =
                new URLSearchParams(window.location.search).get("callbackURL");

            const callbackURL =
                requestedURL?.startsWith("/") && !requestedURL.startsWith("//")
                    ? requestedURL
                    : "/";

            router.replace(callbackURL);
            router.refresh();

        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const requestedURL =
                new URLSearchParams(window.location.search).get("callbackURL");

            const callbackURL =
                requestedURL?.startsWith("/") && !requestedURL.startsWith("//")
                    ? requestedURL
                    : "/";

            await authClient.signIn.social({
                provider: "google",
                callbackURL: `/auth/callback?next=${encodeURIComponent(callbackURL)}`,
            });
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Unable to login with Google.");
        }
    };

    return (<div className="flex min-h-screen items-center justify-center bg-[#fafaf7] px-5 py-16 dark:bg-[#111111]"> <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-[#1c1c1c] lg:grid-cols-2">


        {/* Left Side */}
        <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-[#171717] p-12 text-white lg:flex">
            <div>
                <Link href="/" className="inline-flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c7f36b] text-[#171717]">
                        <Aperture size={25} />
                    </span>

                    <span className="text-2xl font-bold">
                        Studio<span className="text-[#c7f36b]">Space.</span>
                    </span>
                </Link>
            </div>

            <div className="relative z-10">
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[#c7f36b]">
                    Welcome Back
                </p>

                <h1 className="text-5xl font-bold leading-tight">
                    Your creative
                    <br />
                    space awaits.
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
                    Sign in to manage your bookings, explore inspiring studios
                    and continue creating something extraordinary.
                </p>
            </div>

            <p className="text-xs text-white/35">
                © {new Date().getFullYear()} StudioSpace. Made for Creators.
            </p>

            <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full border border-[#c7f36b]/20" />
            <div className="absolute -bottom-20 -right-12 h-60 w-60 rounded-full border border-[#c7f36b]/20" />
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-7 sm:p-12">
            <div className="w-full max-w-md">

                {/* Mobile Logo */}
                <Link
                    href="/"
                    className="mb-10 inline-flex items-center gap-3 lg:hidden"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c7f36b] text-[#171717]">
                        <Aperture size={23} />
                    </span>

                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                        Studio<span className="text-[#8cae3c]">Space.</span>
                    </span>
                </Link>

                {/* Heading */}
                <div className="mb-8">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8cae3c]">
                        Welcome Back
                    </p>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>

                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Enter your details to access your StudioSpace account.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>

                        <input
                            type="email"
                            required
                            autoComplete="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a3cf45] dark:border-gray-700 dark:bg-[#171717] dark:text-white"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a3cf45] dark:border-gray-700 dark:bg-[#171717] dark:text-white"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c7f36b] px-5 py-4 text-sm font-bold text-[#171717] transition hover:bg-[#b5e653] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle size={19} className="animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={19} />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-7 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-400">OR</span>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Google Login */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-[#171717] dark:text-gray-200 dark:hover:bg-[#252525]"
                >
                    <svg
                        viewBox="0 0 48 48"
                        className="h-5 w-5"
                        aria-hidden="true"
                    >
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            transform="translate(0 5)"
                        />
                        <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6c4.51-4.17 7.07-10.31 7.07-17.65z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                            transform="translate(0 0)"
                        />
                        <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                    </svg>

                    Continue with Google
                </button>

                {/* Register Link */}
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href={`/register${window.location.search}`}
                        className="font-bold text-[#8cae3c] transition hover:text-[#a3cf45]"
                    >
                        Create Account
                    </Link>
                </p>

            </div>
        </div>
    </div>
    </div>


    );
}
