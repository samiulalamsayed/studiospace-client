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

const API_URL =
    "https://studiospace-server-sayed-cbee.vercel.app";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Get the previous page URL
    const getCallbackURL = () => {
        const params = new URLSearchParams(window.location.search);
        const requestedURL = params.get("callbackURL");

        if (!requestedURL) return "/";

        try {
            const destination = new URL(
                requestedURL,
                window.location.origin
            );

            if (destination.origin !== window.location.origin) {
                return "/";
            }

            return (
                destination.pathname +
                destination.search +
                destination.hash
            );
        } catch {
            return "/";
        }
    };

    // Set authentication cookie in Express backend
    const setBackendCookie = async () => {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Unable to generate authentication token.");
        }

        const response = await fetch(`${API_URL}/api/auth/set-cookie`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                token: data.token,
            }),
        });

        if (!response.ok) {
            throw new Error(
                "Unable to establish backend authentication."
            );
        }
    };

    // Email & Password Registration
    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const { name, email, image, password } = formData;

        if (!/[A-Z]/.test(password)) {
            toast.error(
                "Password must contain at least one uppercase letter."
            );
            return;
        }

        if (!/[a-z]/.test(password)) {
            toast.error(
                "Password must contain at least one lowercase letter."
            );
            return;
        }

        if (password.length < 6) {
            toast.error(
                "Password must be at least 6 characters long."
            );
            return;
        }

        try {
            setLoading(true);

            // Create account with Better Auth
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
                image: image || undefined,
            });

            if (error) {
                toast.error(
                    error.message || "Registration failed."
                );
                return;
            }

            // Create backend authentication cookie
            await setBackendCookie();

            toast.success("Account created successfully!");

            // Redirect to the previous page
            router.replace(getCallbackURL());
            router.refresh();

        } catch (error) {
            console.error("Registration error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Google Registration
    const handleGoogleSignUp = async () => {
        try {
            setGoogleLoading(true);

            const callbackURL = getCallbackURL();

            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: `/auth/callback?next=${encodeURIComponent(
                    callbackURL
                )}`,
            });

            if (error) {
                toast.error(
                    error.message || "Google Sign Up failed."
                );
                setGoogleLoading(false);
            }

        } catch (error) {
            console.error("Google Sign Up Error:", error);

            toast.error(
                "Something went wrong. Please try again."
            );

            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafaf7] px-5 py-16 dark:bg-[#111111]">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-[#1c1c1c] lg:grid-cols-2">

                {/* Left Side */}
                <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-[#171717] p-12 text-white lg:flex">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c7f36b] text-[#171717]">
                                <Aperture size={25} />
                            </span>

                            <span className="text-2xl font-bold">
                                Studio
                                <span className="text-[#c7f36b]">
                                    Space.
                                </span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10">
                        <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[#c7f36b]">
                            Your Creative Journey Starts Here
                        </p>

                        <h1 className="text-5xl font-bold leading-tight">
                            Find your space.
                            <br />
                            Create your story.
                        </h1>

                        <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
                            Join a community of creators and discover
                            inspiring spaces to bring your creative
                            ideas to life.
                        </p>
                    </div>

                    <p className="text-xs text-white/35">
                        © {new Date().getFullYear()} StudioSpace.
                        Made for Creators.
                    </p>

                    <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full border border-[#c7f36b]/20" />

                    <div className="absolute -bottom-20 -right-12 h-60 w-60 rounded-full border border-[#c7f36b]/20" />
                </div>

                {/* Right Side - Form */}
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
                                Studio
                                <span className="text-[#8cae3c]">
                                    Space.
                                </span>
                            </span>
                        </Link>

                        <div className="mb-8">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8cae3c]">
                                Get Started
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Create an account
                            </h2>

                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                Join StudioSpace and start your creative
                                journey.
                            </p>
                        </div>

                        <form
                            onSubmit={handleRegister}
                            className="space-y-5"
                        >

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a3cf45] dark:border-gray-700 dark:bg-[#171717] dark:text-white"
                                />
                            </div>

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

                            {/* Photo URL */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Profile Photo URL
                                    <span className="ml-2 font-normal text-gray-400">
                                        (Optional)
                                    </span>
                                </label>

                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            image: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a3cf45] dark:border-gray-700 dark:bg-[#171717] dark:text-white"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            })
                                        }
                                        placeholder="Create a password"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a3cf45] dark:border-gray-700 dark:bg-[#171717] dark:text-white"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
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

                                <p className="mt-2 text-xs text-gray-400">
                                    At least 6 characters, including
                                    uppercase and lowercase letters.
                                </p>
                            </div>

                            {/* Create Account */}
                            <button
                                type="submit"
                                disabled={loading || googleLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c7f36b] px-5 py-4 text-sm font-bold text-[#171717] transition hover:bg-[#b5e653] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={19} />
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />

                                <span className="text-xs font-medium text-gray-400">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                            </div>

                            {/* Google Sign Up */}
                            <button
                                type="button"
                                onClick={handleGoogleSignUp}
                                disabled={googleLoading || loading}
                                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-[#202020] dark:text-white dark:hover:bg-[#292929]"
                            >
                                {googleLoading ? (
                                    <LoaderCircle
                                        size={19}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 48 48"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            fill="#FFC107"
                                            d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15z"
                                        />

                                        <path
                                            fill="#4CAF50"
                                            d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.5H5.8v5.3A20 20 0 0 0 24 44z"
                                        />

                                        <path
                                            fill="#1976D2"
                                            d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8z"
                                        />

                                        <path
                                            fill="#FF3D00"
                                            d="M24 12.4c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3c1.6-4.9 6.1-8 11.4-8z"
                                        />
                                    </svg>
                                )}

                                {googleLoading
                                    ? "Connecting to Google..."
                                    : "Continue with Google"}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link
                                href={`/login?callbackURL=${encodeURIComponent(
                                    getCallbackURL()
                                )}`}
                                className="font-bold text-[#8cae3c] transition hover:text-[#a3cf45]"
                            >
                                Log In
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}