"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
    LayoutDashboard,
    Building2,
    CalendarDays,
    Clock,
    CheckCircle2,
    Plus,
    ArrowRight,
    MapPin,
    LoaderCircle,
    UserRound,
    ExternalLink,
    Camera,
    CheckSquare,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL = "https://studiospace-server-sayed-cbee.vercel.app/api";

interface Studio {
    _id: string;
    title: string;
    category: string;
    hourlyRate: number;
    location: string;
    imageUrl: string;
    rating: number;
}

interface Booking {
    _id: string;
    studioTitle?: string;
    userEmail?: string;
    userName?: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: string;
}

type TabType = "Total" | "Pending" | "Confirmed" | "Completed";

export default function DashboardPage() {
    const router = useRouter();

    const { data: session, isPending: sessionLoading } = authClient.useSession();

    const [studios, setStudios] = useState<Studio[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [hostBookings, setHostBookings] = useState<Booking[]>([]);
    const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<TabType>("Total");

    const user = session?.user;

    useEffect(() => {
        if (sessionLoading) return;

        if (!session) {
            router.replace("/login?callbackURL=/dashboard");
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [studioResponse, bookingResponse, hostBookingResponse] =
                    await Promise.all([
                        // Fetch user's studios
                        fetch(
                            `${API_URL}/studios?ownerEmail=${encodeURIComponent(
                                session.user.email
                            )}`
                        ),

                        // Fetch customer's bookings
                        fetch(`${API_URL}/bookings`, {
                            credentials: "include",
                        }),

                        // Fetch host's bookings
                        fetch(`${API_URL}/bookings/host`, {
                            credentials: "include",
                        }),
                    ]);

                if (
                    !studioResponse.ok ||
                    !bookingResponse.ok ||
                    !hostBookingResponse.ok
                ) {
                    throw new Error("Failed to load dashboard data.");
                }

                const studioData = await studioResponse.json();
                const bookingData = await bookingResponse.json();
                const hostBookingData = await hostBookingResponse.json();

                setStudios(studioData);
                setBookings(bookingData);
                setHostBookings(hostBookingData);
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [session, sessionLoading, router]);

    const pendingBookings = bookings.filter((booking) => booking.status === "Pending");
    const confirmedBookings = bookings.filter((booking) => booking.status === "Confirmed");
    const completedBookings = bookings.filter((booking) => booking.status === "Completed");

    const totalActiveBookings = bookings.filter((booking) => booking.status !== "Completed");

    const displayedBookings =
        activeTab === "Total" ? totalActiveBookings :
            activeTab === "Pending" ? pendingBookings :
                activeTab === "Confirmed" ? confirmedBookings :
                    completedBookings;

    const handleBookingStatus = async (
        bookingId: string,
        status: "Confirmed" | "Cancelled" | "Completed"
    ) => {
        if (!user?.email) return;

        try {
            setUpdatingBooking(bookingId);

            const response = await fetch(
                `${API_URL}/bookings/${bookingId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update booking.");
            }

            setHostBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status }
                        : booking
                )
            );

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === bookingId
                        ? { ...booking, status }
                        : booking
                )
            );

            toast.success(data.message);

        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setUpdatingBooking(null);
        }
    };

    const formatDate = (date: string) => {
        if (!date) return "Date unavailable";
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
            case "Completed":
                return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
            case "Cancelled":
                return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
            default:
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
        }
    };

    if (loading || sessionLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#fafaf7] dark:bg-[#111111]">
                <div className="flex items-center gap-3 text-gray-500">
                    <LoaderCircle
                        size={24}
                        className="animate-spin text-lime-500"
                    />
                    Loading dashboard...
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <main className="min-h-screen bg-[#fafaf7] px-5 py-10 text-[#171717] dark:bg-[#111111] dark:text-white md:px-10">
            <div className="mx-auto max-w-7xl">

                {/* Page Heading */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8cae3c]">
                            <LayoutDashboard size={15} />
                            Dashboard Overview
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Welcome back, {user?.name || "Creator"}!
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Here's what's happening with your StudioSpace account.
                        </p>
                    </div>

                    <Link
                        href="/add-studio"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c7f36b] px-5 py-3 text-sm font-bold text-[#171717] transition hover:bg-[#b8e45b]"
                    >
                        <Plus size={18} />
                        Add New Studio
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#1c1c1c] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt={user.name || "Profile"}
                                className="h-14 w-14 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c7f36b] text-[#171717]">
                                <UserRound size={26} />
                            </div>
                        )}

                        <div>
                            <h2 className="text-lg font-bold">
                                {user?.name || "User"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/my-listings"
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold transition hover:border-lime-400 dark:border-white/10"
                        >
                            My Listings
                        </Link>

                        <Link
                            href="/my-bookings"
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold transition hover:border-lime-400 dark:border-white/10"
                        >
                            My Bookings
                        </Link>
                    </div>
                </div>

                {/* Interactive Booking Statistics Cards */}
                <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

                {/* Booking Details Table / List */}
                <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#1c1c1c]">
                    <div className="mb-6 flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 dark:border-white/10 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-bold">
                                {activeTab} Booking Details
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Viewing all {activeTab.toLowerCase()} requests
                            </p>
                        </div>
                        <Link
                            href="/my-bookings"
                            className="flex items-center gap-1 text-sm font-semibold text-lime-600 transition hover:text-lime-700"
                        >
                            Manage All
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {displayedBookings.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center dark:border-white/10">
                            <CalendarDays size={30} className="mx-auto mb-3 text-gray-400" />
                            <p className="font-semibold">No {activeTab.toLowerCase()} bookings found</p>
                            <p className="mt-1 text-xs text-gray-500">
                                {activeTab === "Total"
                                    ? "You haven't made any active bookings yet."
                                    : `There are no bookings with ${activeTab.toLowerCase()} status.`}
                            </p>
                            {activeTab === "Total" && (
                                <Link
                                    href="/studios"
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#c7f36b] px-4 py-2 text-xs font-bold text-black hover:bg-[#b8e45b]"
                                >
                                    Explore Studios
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {displayedBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-5 transition hover:shadow-sm dark:border-white/10"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="truncate font-bold text-[#171717] dark:text-white">
                                            {booking.studioTitle || "Studio Booking"}
                                        </h3>
                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${getStatusStyle(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays size={13} />
                                            <span>{formatDate(booking.bookingDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={13} />
                                            <span>{booking.startTime} - {booking.endTime}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 border-t border-gray-50 pt-3 dark:border-white/5">
                                        <p className="text-sm font-bold text-[#8cae3c]">
                                            Total: ${booking.totalPrice}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Big My Studios Section */}
                <section className="mb-10 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-[#1c1c1c]">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lime-100 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400">
                        <Building2 size={32} />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight">My Studios</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Total studio listings you own on StudioSpace
                    </p>

                    <div className="my-6">
                        <span className="text-7xl font-black text-[#171717] dark:text-white">
                            {studios.length}
                        </span>
                    </div>

                    {studios.length === 0 ? (
                        <Link
                            href="/add-studio"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c7f36b] px-6 py-3 text-sm font-bold text-[#171717] transition hover:bg-[#b8e45b]"
                        >
                            <Plus size={18} />
                            Add Your First Studio
                        </Link>
                    ) : (
                        <Link
                            href="/my-listings"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold transition hover:border-lime-400 dark:border-white/10"
                        >
                            Manage Your Studios
                            <ArrowRight size={16} />
                        </Link>
                    )}
                </section>

                {/* Host Booking Management - Only visible if user has created studios */}
                {studios.length > 0 && (
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#1c1c1c]">
                        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Host Booking Management
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Manage reservations for your studio listings.
                                </p>
                            </div>

                            <span className="w-fit rounded-full bg-lime-100 px-3 py-1.5 text-xs font-bold text-lime-700 dark:bg-lime-500/10 dark:text-lime-400">
                                {hostBookings.length} Total Requests
                            </span>
                        </div>

                        {hostBookings.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center dark:border-white/10">
                                <CalendarDays
                                    size={30}
                                    className="mx-auto mb-3 text-gray-400"
                                />

                                <p className="font-semibold">
                                    No Booking Requests Yet
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Bookings for your studios will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {hostBookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="rounded-xl border border-gray-100 p-5 dark:border-white/10"
                                    >
                                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                                            {/* Booking Information */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-bold">
                                                        {booking.studioTitle || "Studio Booking"}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${getStatusStyle(
                                                            booking.status
                                                        )}`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </div>

                                                <p className="mt-3 text-xs text-gray-500">
                                                    Booking ID: {booking._id}
                                                </p>

                                                <div className="mt-3 grid gap-2 text-xs text-gray-500 sm:grid-cols-2">
                                                    <p>
                                                        Customer: {booking.userName || "Unknown"}
                                                    </p>

                                                    <p>
                                                        Email: {booking.userEmail || "N/A"}
                                                    </p>

                                                    <p>
                                                        Date: {formatDate(booking.bookingDate)}
                                                    </p>

                                                    <p>
                                                        Time: {booking.startTime} - {booking.endTime}
                                                    </p>
                                                </div>

                                                <p className="mt-3 text-sm font-bold">
                                                    Total: ${booking.totalPrice}
                                                </p>
                                            </div>

                                            {/* Host Actions */}
                                            <div className="flex flex-wrap gap-2">
                                                {booking.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleBookingStatus(
                                                                    booking._id,
                                                                    "Confirmed"
                                                                )
                                                            }
                                                            disabled={updatingBooking === booking._id}
                                                            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {updatingBooking === booking._id
                                                                ? "Updating..."
                                                                : "Confirm"}
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleBookingStatus(
                                                                    booking._id,
                                                                    "Cancelled"
                                                                )
                                                            }
                                                            disabled={updatingBooking === booking._id}
                                                            className="rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200 disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {booking.status === "Confirmed" && (
                                                    <button
                                                        onClick={() =>
                                                            handleBookingStatus(
                                                                booking._id,
                                                                "Completed"
                                                            )
                                                        }
                                                        disabled={updatingBooking === booking._id}
                                                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        {updatingBooking === booking._id
                                                            ? "Updating..."
                                                            : "Mark Completed"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Footer Summary */}
                <div className="mt-8 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        Dashboard Overview · StudioSpace
                    </p>

                    <p>
                        Completed Bookings: {completedBookings.length}
                    </p>
                </div>
            </div>
        </main>
    );
}