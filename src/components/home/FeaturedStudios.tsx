"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import StudioCard, {
    type Studio,
} from "@/components/shared/StudioCard";

export default function FeaturedStudios() {
    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudios = async () => {
            try {
                const response = await fetch(
                    "https://studiospace-server-sayed-cbee.vercel.app/api/studios"
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch studios");
                }

                const data = await response.json();
                setStudios(data);
            } catch (error) {
                console.error("Studio fetching error:", error);
                setError("Unable to load studios. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudios();
    }, []);

    return (
        <section className="bg-white px-5 py-24 dark:bg-[#151515] sm:py-32 md:px-10">
            <div className="mx-auto max-w-[1440px]">

                {/* Section Header */}
                <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        {/* Eyebrow */}
                        <div className="mb-6 flex items-center gap-4">
                            <span className="flex h-1.5 w-8 rounded-full bg-[#c7f36b]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                                Handpicked Spaces
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-[36px] font-black leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:text-[42px] md:text-[52px]">
                            Featured <span className="text-gray-400 dark:text-gray-500">studios.</span>
                        </h2>
                    </div>

                    <Link
                        href="/studios"
                        className="group hidden items-center gap-2 pb-2 text-[15px] font-bold text-gray-600 transition-colors hover:text-[#8cae3c] dark:text-gray-400 dark:hover:text-[#c7f36b] md:flex"
                    >
                        Explore All Studios
                        <ArrowUpRight
                            size={20}
                            strokeWidth={2.5}
                            className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* Loading State (Refined Skeletons) */}
                {loading && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex h-[420px] flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white p-2 dark:border-white/5 dark:bg-[#1a1a1a]"
                            >
                                <div className="h-[220px] w-full animate-pulse rounded-[24px] bg-gray-100 dark:bg-white/5" />
                                <div className="flex flex-1 flex-col justify-between px-3 py-5">
                                    <div className="space-y-4">
                                        <div className="h-4 w-1/3 animate-pulse rounded-full bg-gray-100 dark:bg-white/5" />
                                        <div className="h-6 w-3/4 animate-pulse rounded-full bg-gray-100 dark:bg-white/5" />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4 dark:border-white/5">
                                        <div className="h-6 w-1/4 animate-pulse rounded-full bg-gray-100 dark:bg-white/5" />
                                        <div className="h-12 w-12 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[32px] border border-dashed border-red-200 bg-red-50/50 p-8 text-center dark:border-red-500/20 dark:bg-red-500/5">
                        <p className="text-[15px] font-medium text-red-600 dark:text-red-400">
                            {error}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-[#202020] dark:text-gray-300 dark:ring-white/10 dark:hover:bg-[#252525]"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && studios.length === 0 && (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[32px] border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-white/10 dark:bg-white/5">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm dark:bg-[#202020]">
                            <ArrowUpRight size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            No studios available yet
                        </h3>
                        <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400">
                            Be the first to share your creative space with the community.
                        </p>
                        <Link
                            href="/add-studio"
                            className="mt-6 rounded-xl bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800 dark:bg-white dark:text-[#111111] dark:hover:bg-gray-200"
                        >
                            Host Your Space
                        </Link>
                    </div>
                )}

                {/* Studio Cards Grid */}
                {!loading && !error && studios.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                        {studios.map((studio) => (
                            <StudioCard
                                key={studio._id}
                                studio={studio}
                            />
                        ))}
                    </div>
                )}

                {/* Bottom Link (Mobile Only) */}
                {!loading && !error && studios.length > 0 && (
                    <div className="mt-12 text-center md:hidden">
                        <Link
                            href="/studios"
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-8 py-4 text-[15px] font-bold text-gray-900 transition-colors hover:border-[#c7f36b] hover:bg-[#c7f36b] dark:border-gray-800 dark:text-white dark:hover:border-[#c7f36b] dark:hover:text-[#111111]"
                        >
                            Discover All Studios
                            <ArrowUpRight size={18} strokeWidth={2.5} />
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
}