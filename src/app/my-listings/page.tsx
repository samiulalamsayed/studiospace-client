"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    Aperture,
    ArrowLeft,
    Building2,
    CalendarDays,
    Edit3,
    Eye,
    LoaderCircle,
    MapPin,
    Plus,
    Star,
    Trash2,
    X,
    Users
} from "lucide-react";

import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

interface Studio {
    _id: string;
    title: string;
    category: string;
    hourlyRate: number;
    securityDeposit: number;
    maxCapacity: number;
    location: string;
    imageUrl: string;
    amenities: string[];
    overview: string;
    ownerEmail: string;
    ownerName: string;
    rating: number;
    createdAt: string;
}

export default function MyListingsPage() {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedStudio, setSelectedStudio] = useState<Studio | null>(
        null
    );

    const [deleting, setDeleting] = useState(false);

    const user = session?.user;

    // Redirect unauthenticated users
    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login");
        }
    }, [isPending, session, router]);

    // Fetch user's studios
    const fetchMyStudios = useCallback(async () => {
        if (!user?.email) return;

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `https://studiospace-server-sayed-cbee.vercel.app/api/studios?ownerEmail=${encodeURIComponent(
                    user.email
                )}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load your studio listings.");
            }

            const data = await response.json();

            setStudios(data);
        } catch (error) {
            console.error("My Listings Error:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        if (user?.email) {
            fetchMyStudios();
        }
    }, [user?.email, fetchMyStudios]);

    // Delete Studio
    const handleDelete = async () => {
        if (!selectedStudio) return;

        try {
            setDeleting(true);

            const response = await fetch(
                `https://studiospace-server-sayed-cbee.vercel.app/api/studios/${selectedStudio._id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete studio."
                );
            }

            setStudios((prev) =>
                prev.filter(
                    (studio) => studio._id !== selectedStudio._id
                )
            );

            toast.success("Studio deleted successfully!");

            setSelectedStudio(null);
        } catch (error) {
            console.error("Delete Studio Error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setDeleting(false);
        }
    };

    // Authentication Loading
    if (isPending || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fafaf7] dark:bg-[#111111]">
                <LoaderCircle
                    size={35}
                    className="animate-spin text-[#8dbb37]"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf7] px-4 py-12 dark:bg-[#111111] sm:px-6 lg:px-8">

            <div className="mx-auto max-w-[1200px]">

                {/* Header */}
                <div className="mb-10">

                    <Link
                        href="/"
                        className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#8dbb37]"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </Link>

                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#8dbb37]">
                                Host Dashboard
                            </p>

                            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                My Studio Listings
                            </h1>

                            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Manage your creative spaces and keep your listings up to date.
                            </p>
                        </div>

                        <Link
                            href="/add-studio"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c7f36b] px-6 py-3.5 text-sm font-bold text-[#171717] transition-all hover:scale-105 hover:bg-[#b5e653]"
                        >
                            <Plus size={19} />
                            Add New Studio
                        </Link>

                    </div>
                </div>

                {/* Statistics */}
                <div className="mb-10 grid gap-5 sm:grid-cols-2">

                    <div className="rounded-[24px] border border-gray-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1a1a1a]">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Total Listings
                                </p>

                                <h2 className="mt-2 text-4xl font-black text-gray-900 dark:text-white">
                                    {loading ? "—" : studios.length}
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c7f36b]/20 text-[#719b24] dark:bg-[#c7f36b]/10">
                                <Building2 size={26} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-gray-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#1a1a1a]">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Host Account
                                </p>

                                <h2 className="mt-2 truncate text-xl font-bold text-gray-900 dark:text-white">
                                    {user.name}
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <Aperture size={26} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-[24px] border border-gray-200/60 bg-white p-2 dark:border-white/5 dark:bg-[#1a1a1a]"
                            >
                                <div className="h-56 animate-pulse rounded-[18px] bg-gray-200 dark:bg-white/5" />

                                <div className="space-y-4 p-4">
                                    <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-white/5" />
                                    <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-white/5" />
                                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/5" />
                                    <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-white/5" />
                                </div>
                            </div>
                        ))}

                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-[24px] border border-red-200 bg-red-50 p-10 text-center dark:border-red-900/40 dark:bg-red-950/20">

                        <p className="font-semibold text-red-600 dark:text-red-400">
                            {error}
                        </p>

                        <button
                            onClick={fetchMyStudios}
                            className="mt-5 rounded-xl bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800 dark:bg-white dark:text-[#111111]"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && studios.length === 0 && (
                    <div className="rounded-[32px] border border-dashed border-gray-300 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-[#1a1a1a]">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#c7f36b]/20 text-[#719b24] dark:bg-[#c7f36b]/10">
                            <Building2 size={36} strokeWidth={2.5} />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                            No Studios Yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            You have not published any creative spaces yet. Add your first studio and start sharing your space with creators.
                        </p>

                        <Link
                            href="/add-studio"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#c7f36b] px-6 py-3.5 text-sm font-bold text-[#171717] transition-all hover:scale-105 hover:bg-[#b5e653]"
                        >
                            <Plus size={18} />
                            Add Your First Studio
                        </Link>

                    </div>
                )}

                {/* Studio Grid */}
                {!loading && !error && studios.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {studios.map((studio) => (
                            <article
                                key={studio._id}
                                className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-gray-200/60 bg-white p-2 transition-all duration-300 hover:-translate-y-1 hover:border-[#c7f36b]/50 hover:shadow-xl dark:border-white/5 dark:bg-[#1a1a1a]"
                            >

                                <div>
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-gray-100 dark:bg-gray-800">

                                        <img
                                            src={studio.imageUrl}
                                            alt={studio.title}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                        />

                                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black tracking-wider text-gray-900 shadow-sm backdrop-blur-md">
                                            {studio.category}
                                        </span>

                                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1.5 text-[12px] font-bold text-white shadow-sm backdrop-blur-md">
                                            <Star
                                                size={12}
                                                className="fill-[#c7f36b] text-[#c7f36b]"
                                            />
                                            {Number(studio.rating || 0).toFixed(1)}
                                        </div>

                                    </div>

                                    {/* Content */}
                                    <div className="p-4">

                                        <div className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-gray-500 dark:text-gray-400">
                                            <MapPin size={14} className="text-[#8cae3c]" />
                                            <span className="line-clamp-1">
                                                {studio.location}
                                            </span>
                                        </div>

                                        <h2 className="line-clamp-1 text-xl font-bold text-gray-900 dark:text-white">
                                            {studio.title}
                                        </h2>

                                        <div className="my-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/5">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                                Hourly Rate
                                            </p>

                                            <p className="text-xl font-black text-gray-900 dark:text-white">
                                                ${studio.hourlyRate}
                                                <span className="text-xs font-normal text-gray-500">
                                                    {" "}/ hr
                                                </span>
                                            </p>
                                        </div>

                                        <div className="mb-5 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1.5">
                                                <Users size={14} className="text-[#8cae3c]" />
                                                {studio.maxCapacity} People
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays size={14} className="text-[#8cae3c]" />
                                                {new Date(studio.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-3 gap-2 p-2 pt-0">

                                    <Link
                                        href={`/studios/${studio._id}`}
                                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#c7f36b] px-2 py-3 text-xs font-bold text-[#111111] transition hover:bg-[#b5e653]"
                                    >
                                        <Eye size={15} strokeWidth={2.5} />
                                        View
                                    </Link>

                                    <Link
                                        href={`/studios/edit/${studio._id}`}
                                        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-2 py-3 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        <Edit3 size={15} strokeWidth={2.5} />
                                        Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedStudio(studio)
                                        }
                                        className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-2 py-3 text-xs font-bold text-red-500 transition hover:bg-red-50 dark:border-red-900/50 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                                    >
                                        <Trash2 size={15} strokeWidth={2.5} />
                                        Delete
                                    </button>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </div>

            {/* Delete Confirmation Modal */}
            {selectedStudio && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5 py-8 backdrop-blur-sm animate-in fade-in duration-200">

                    <div className="w-full max-w-md rounded-[32px] border border-gray-200/60 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]">

                        <div className="flex items-center justify-between">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                                <Trash2 size={26} strokeWidth={2.5} />
                            </div>

                            <button
                                onClick={() => setSelectedStudio(null)}
                                disabled={deleting}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 dark:hover:bg-white/5"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <h2 className="mt-6 text-2xl font-black text-gray-900 dark:text-white">
                            Delete this Studio?
                        </h2>

                        <p className="mt-3 text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete{" "}
                            <span className="font-bold text-gray-900 dark:text-white">
                                {selectedStudio.title}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-8 flex gap-3">

                            <button
                                onClick={() => setSelectedStudio(null)}
                                disabled={deleting}
                                className="flex-1 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting ? (
                                    <>
                                        <LoaderCircle
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} strokeWidth={2.5} />
                                        Delete Studio
                                    </>
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}