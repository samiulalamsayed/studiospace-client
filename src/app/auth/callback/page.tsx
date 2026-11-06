"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const API_URL =
    "https://studiospace-server-sayed-cbee.vercel.app";

export default function AuthCallbackPage() {
    const router = useRouter();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const setupAuthentication = async () => {
            try {
                // Wait until Better Auth session is available
                const { data: sessionData, error: sessionError } =
                    await authClient.getSession();

                if (sessionError || !sessionData?.session) {
                    throw new Error(
                        "Unable to establish your login session."
                    );
                }

                // Get requested destination
                const params = new URLSearchParams(
                    window.location.search
                );

                const requestedURL = params.get("next");

                // Validate destination
                let callbackURL = "/";

                if (requestedURL) {
                    const destination = new URL(
                        requestedURL,
                        window.location.origin
                    );

                    if (destination.origin === window.location.origin) {
                        callbackURL =
                            destination.pathname +
                            destination.search +
                            destination.hash;
                    }
                }

                // Generate JWT from Better Auth
                const { data, error } = await authClient.token();

                if (error || !data?.token) {
                    throw new Error(
                        "Unable to generate authentication token."
                    );
                }

                // Set HTTPOnly Cookie in Express Backend
                const response = await fetch(
                    `${API_URL}/api/auth/set-cookie`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            token: data.token,
                        }),
                    }
                );

                if (!response.ok) {
                    const result = await response.json().catch(() => null);

                    throw new Error(
                        result?.message ||
                        "Unable to establish backend authentication."
                    );
                }

                toast.success("Login successful!");

                // Redirect to requested destination
                router.replace(callbackURL);
                router.refresh();

            } catch (error) {
                console.error(
                    "Authentication callback error:",
                    error
                );

                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Authentication failed."
                );

                router.replace("/login");
            }
        };

        setupAuthentication();
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafaf7] dark:bg-[#111111]">
            <div className="text-center">
                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#c7f36b] border-t-transparent" />

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completing your sign in...
                </p>
            </div>
        </div>
    );
}