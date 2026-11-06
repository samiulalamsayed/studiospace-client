"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthCallbackPage() {
    const router = useRouter();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const setupAuthentication = async () => {
            try {
                // Get requested destination
                const requestedURL = new URLSearchParams(
                    window.location.search
                ).get("next");

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

                // Get JWT from Better Auth
                const { data, error } = await authClient.token();

                if (error || !data?.token) {
                    throw new Error("Unable to generate JWT.");
                }

                // Set HTTPOnly Cookie in Express
                const response = await fetch(
                    "https://studiospace-server-sayed-cbee.vercel.app/api/auth/set-cookie",
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
                    throw new Error(
                        "Unable to set authentication cookie."
                    );
                }

                // Redirect to requested page
                router.replace(callbackURL);
                router.refresh();

            } catch (error) {
                console.error("Authentication callback error:", error);

                alert(
                    error instanceof Error
                        ? error.message
                        : "Unknown authentication error"
                );
            }
        };

        setupAuthentication();
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-gray-500">
                Completing your sign in...
            </p>
        </div>
    );
}