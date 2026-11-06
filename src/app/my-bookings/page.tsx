"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    CalendarDays,
    Clock,
    MapPin,
    LoaderCircle,
    XCircle,
    ArrowRight,
    CalendarCheck,
    RefreshCw,
    CheckCircle2,
    CheckSquare,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const API_URL = "https://studiospace-server-sayed-cbee.vercel.app/api/bookings";

interface Booking {
    _id: string;
    studioId: string;
    studioTitle?: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
    userEmail: string;
    userName: string;
}

type TabType = "Total" | "Pending" | "Confirmed" | "Completed";

const statusStyles: Record<string, string> = {
    Pending:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    Confirmed:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    Completed:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    Cancelled:
        "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function MyBookingsPage() {
    const router = useRouter();

    const { data: session, isPending: sessionLoading } = authClient.useSession();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [cancelTarget, setCancelTarget] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("Total");

    const fetchBookings = useCallback(async () => {
        if (!session?.user?.email) return;

        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }

            const data = await response.json();
            setBookings(data);
        } catch {
            toast.error("Could not load your bookings.");
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (sessionLoading) return;

        if (!session) {
            router.replace("/login?callbackURL=/my-bookings");
            return;
        }

        fetchBookings();
    }, [session, sessionLoading, router, fetchBookings]);

    const handleCancel = async () => {
        if (!cancelTarget) return;

        setCancellingId(cancelTarget);

        try {
            const response = await fetch(
                `${API_URL}/${cancelTarget}/cancel`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to cancel booking");
            }

            setBookings((previous) =>
                previous.map((booking) =>
                    booking._id === cancelTarget
                        ? { ...booking, status: "Cancelled" }
                        : booking
                )
            );

            toast.success("Booking cancelled successfully!");
            setCancelTarget(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setCancellingId(null);
        }
    };

    // Derived states for tabs
    const pendingBookings = bookings.filter((b) => b.status === "Pending");
    const confirmedBookings = bookings.filter((b) => b.status === "Confirmed");
    const completedBookings = bookings.filter((b) => b.status === "Completed");
    const totalActiveBookings = bookings.filter((b) => b.status !== "Completed");

    const displayedBookings =
        activeTab === "Total" ? totalActiveBookings :
            activeTab === "Pending" ? pendingBookings :
                activeTab === "Confirmed" ? confirmedBookings :
                    completedBookings;

    if (loading || sessionLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#fafaf7] dark:bg-[#111111]">
                <LoaderCircle className="h-8 w-8 animate-spin text-lime-500" />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-[#fafaf7] px-5 py-12 dark:bg-[#111111] md:px-10">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-lime-600">
                            Your Reservations
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
                            My Bookings
                        </h1>

                        <p className="mt-2 text-sm text-neutral-500">
                            Manage and track all your studio reservations.
                        </p>
                    </div>

                    <button
                        onClick={fetchBookings}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-100 dark:border-white/10 dark:bg-[#1c1c1c] dark:hover:bg-white/5"
                    >
                        <RefreshCw size={15} />
                        Refresh
                    </button>
                </div>

                {/* Interactive Stats Cards / Tabs */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        {
                            id: "Total",
                            title: "Total Bookings",
                            desc: "Active booking requests",
                            count: totalActiveBookings.length,
                            icon: CalendarDays,
                            color: "blue"
                        },
                        {
                            id: "Pending",
                            title: "Pending Bookings",
                            desc: "Waiting for host response",
                            count: pendingBookings.length,
                            icon: Clock,
                            color: "yellow"
                        },
                        {
                            id: "Confirmed",
                            title: "Confirmed Bookings",
                            desc: "Successfully confirmed",
                            count: confirmedBookings.length,
                            icon: CheckCircle2,
                            color: "green"
                        },
                        {
                            id: "Completed",
                            title: "Completed Bookings",
                            desc: "Past finished sessions",
                            count: completedBookings.length,
                            icon: CheckSquare,
                            color: "purple"
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex flex-col rounded-2xl border p-6 text-left transition-all ${activeTab === tab.id
                                ? `border-${tab.color}-500 bg-${tab.color}-50/50 shadow-sm ring-1 ring-${tab.color}-500 dark:bg-${tab.color}-500/10`
                                : `border-gray-200 bg-white hover:border-${tab.color}-300 dark:border-white/10 dark:bg-[#1c1c1c]`
                                }`}
                        >
                            <div className="mb-5 flex w-full items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {tab.title}
                                </span>
                                <div className={`rounded-xl bg-${tab.color}-100 p-3 text-${tab.color}-700 dark:bg-${tab.color}-500/10 dark:text-${tab.color}-400`}>
                                    <tab.icon size={21} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold">{tab.count}</h3>
                            <p className="mt-2 text-xs text-gray-500">{tab.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Booking Details Section */}
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/10">
                    <div>
                        <h2 className="text-lg font-bold">
                            {activeTab} Booking Details
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Viewing all {activeTab.toLowerCase()} requests
                        </p>
                    </div>
                </div>

                {/* Empty State */}
                {displayedBookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-[#1c1c1c]">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-100 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400">
                            <CalendarCheck size={30} />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-neutral-900 dark:text-white">
                            No {activeTab.toLowerCase()} bookings found
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
                            {activeTab === "Total"
                                ? "You haven't made any active bookings yet. Explore studios and find the perfect space for your next project."
                                : `There are no bookings with ${activeTab.toLowerCase()} status.`}
                        </p>

                        {activeTab === "Total" && (
                            <Link
                                href="/studios"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c7f36b] px-6 py-3 font-semibold text-neutral-950 transition hover:bg-[#b8e45b]"
                            >
                                Explore Studios
                                <ArrowRight size={17} />
                            </Link>
                        )}
                    </div>
                ) : (
                    /* Bookings List */
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {displayedBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-[#c7f36b] hover:shadow-md dark:border-white/10 dark:bg-[#1c1c1c] sm:p-6"
                            >
                                <div>
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                        <span className="text-xs font-semibold text-neutral-400">
                                            Booking ID: {booking._id.slice(-8)}
                                        </span>

                                        <span
                                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusStyles[booking.status] ||
                                                "bg-neutral-100 text-neutral-600"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                        {booking.studioTitle || "Studio Reservation"}
                                    </h2>

                                    <div className="mt-4 space-y-3 text-sm font-medium text-neutral-500">
                                        <p className="flex items-center gap-2">
                                            <CalendarDays size={16} className="text-[#8cae3c]" />
                                            {new Date(booking.bookingDate).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </p>

                                        <p className="flex items-center gap-2">
                                            <Clock size={16} className="text-[#8cae3c]" />
                                            {booking.startTime} - {booking.endTime}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-5 dark:border-white/10">
                                        <div>
                                            <p className="text-xs text-neutral-500">Total Price</p>
                                            <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                                                ${booking.totalPrice}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                        <Link
                                            href={`/studios/${booking.studioId}`}
                                            className="group inline-flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-200 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10"
                                        >
                                            View Studio
                                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                                        </Link>

                                        {booking.status === "Pending" && (
                                            <button
                                                onClick={() => setCancelTarget(booking._id)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                                            >
                                                <XCircle size={16} />
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            {cancelTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10">
                            <XCircle size={32} />
                        </div>

                        <h3 className="mt-5 text-center text-2xl font-bold text-neutral-900 dark:text-white">
                            Cancel Booking?
                        </h3>

                        <p className="mt-3 text-center text-sm leading-relaxed text-neutral-500">
                            Are you sure you want to cancel this booking? This action cannot
                            be undone.
                        </p>

                        <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                            <button
                                onClick={() => setCancelTarget(null)}
                                disabled={!!cancellingId}
                                className="w-full rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-white/5 sm:w-auto"
                            >
                                Keep Booking
                            </button>

                            <button
                                onClick={handleCancel}
                                disabled={!!cancellingId}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60 sm:w-auto"
                            >
                                {cancellingId ? (
                                    <LoaderCircle size={18} className="animate-spin" />
                                ) : null}
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}