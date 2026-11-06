"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Search,
    SlidersHorizontal,
    Camera,
    Clapperboard,
    Mic2,
    Music2,
    Palette,
    LoaderCircle,
} from "lucide-react";

import StudioCard, {
    type Studio,
} from "@/components/shared/StudioCard";

const categories = [
    { label: "All Studios", value: "All", icon: SlidersHorizontal },
    { label: "Photo Studios", value: "Photo Studio", icon: Camera },
    { label: "Sound Stages", value: "Film Stage", icon: Clapperboard },
    { label: "Podcast Rooms", value: "Podcast Lounge", icon: Mic2 },
    { label: "Music Suites", value: "Music Suite", icon: Music2 },
    { label: "Art Workshops", value: "Workshop", icon: Palette },
];

export default function StudiosPage() {
    const searchParams = useSearchParams();

    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");

    // Category from URL
    useEffect(() => {
        const category = searchParams.get("category");


        if (category) {
            setSelectedCategory(category);
        } else {
            setSelectedCategory("All");
        }


    }, [searchParams]);

    // Fetch Studios
    useEffect(() => {
        const fetchStudios = async () => {
            try {
                setLoading(true);
                setError("");


                const response = await fetch(
                    "https://studiospace-server-sayed-cbee.vercel.app/api/studios"
                );

                if (!response.ok) {
                    throw new Error("Failed to load studios.");
                }

                const data = await response.json();

                setStudios(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudios();


    }, []);

    // Filter Studios
    const filteredStudios = studios.filter((studio) => {
        const matchesCategory =
            selectedCategory === "All" ||
            studio.category === selectedCategory;


        const matchesSearch =
            studio.title.toLowerCase().includes(search.toLowerCase()) ||
            studio.location.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;


    });

    return (<div className="min-h-screen bg-[#fafaf7] px-5 pb-24 pt-16 text-[#171717] dark:bg-[#111111] dark:text-white md:px-10"> <div className="mx-auto max-w-7xl">


        {/* Page Heading */}
        <div className="mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#8cae3c]">
                Find Your Creative Space
            </p>

            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
                Explore studios.
                <br />
                <span className="text-[#9bbd50]">
                    Create something great.
                </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500 dark:text-gray-400 md:text-base">
                Discover inspiring creative spaces for photography, music,
                podcasts, filmmaking and everything in between.
            </p>
        </div>

        {/* Search */}
        <div className="mb-10 flex max-w-xl items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-[#1c1c1c]">
            <Search size={20} className="shrink-0 text-gray-400" />

            <input
                type="text"
                placeholder="Search by studio name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
        </div>

        {/* Categories */}
        <div className="mb-10">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                    Browse Categories
                </h2>

                <span className="text-xs text-gray-500">
                    {filteredStudios.length} studios found
                </span>
            </div>

            <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive =
                        selectedCategory === category.value;

                    return (
                        <button
                            key={category.value}
                            onClick={() =>
                                setSelectedCategory(category.value)
                            }
                            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${isActive
                                    ? "border-[#c7f36b] bg-[#c7f36b] text-[#171717]"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-[#c7f36b] dark:border-white/10 dark:bg-[#1c1c1c] dark:text-gray-300"
                                }`}
                        >
                            <Icon size={17} />
                            {category.label}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Studios Heading */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-5 dark:border-white/10">
            <h2 className="text-2xl font-bold">
                Available Studios
            </h2>

            <span className="text-sm text-gray-500">
                {filteredStudios.length} results
            </span>
        </div>

        {/* Loading State */}
        {loading ? (
            <div className="flex min-h-64 items-center justify-center">
                <div className="flex items-center gap-3 text-gray-500">
                    <LoaderCircle
                        className="animate-spin"
                        size={22}
                    />
                    Loading studios...
                </div>
            </div>

        ) : error ? (
            /* Error State */
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20">
                <p className="font-medium text-red-500">
                    {error}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                    Please check whether the server is running.
                </p>
            </div>

        ) : filteredStudios.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center dark:border-white/20">
                <Search
                    className="mx-auto mb-4 text-gray-400"
                    size={35}
                />

                <h3 className="text-xl font-bold">
                    No studios found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                    Try another category or search keyword.
                </p>

                <button
                    onClick={() => {
                        setSelectedCategory("All");
                        setSearch("");
                    }}
                    className="mt-6 rounded-xl bg-[#c7f36b] px-5 py-3 text-sm font-bold text-black"
                >
                    Clear Filters
                </button>
            </div>

        ) : (
            /* Studio Cards */
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStudios.map((studio) => (
                    <StudioCard
                        key={studio._id}
                        studio={studio}
                    />
                ))}
            </div>
        )}

    </div>
    </div>

    );
}
