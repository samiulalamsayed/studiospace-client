import { Camera, LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-[var(--background)] px-6">
            <div className="flex flex-col items-center text-center">
                {/* Loading Animation */}
                <div className="relative mb-7 flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#c7f36b]/20" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-[#c7f36b]/30 bg-[#c7f36b]/10">
                        <Camera
                            size={38}
                            strokeWidth={1.5}
                            className="text-[#9bc94c]"
                        />
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
                    Preparing Your Creative Space
                </h2>

                <p className="mb-6 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                    Please wait while we get everything ready for you.
                </p>

                {/* Spinner */}
                <LoaderCircle
                    size={25}
                    className="animate-spin text-[#9bc94c]"
                />

                <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                    StudioSpace
                </p>
            </div>
        </main>
    );
}