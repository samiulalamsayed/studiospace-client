"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GalleryCarousel from "@/components/shared/GalleryCarousel";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Check,
    Clock,
    MapPin,
    ShieldCheck,
    Star,
    Users,
    X,
    LoaderCircle,
    Camera,
    Mail,
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
    imageUrls?: string[];
    amenities: string[];
    overview: string;
    ownerEmail: string;
    ownerName: string;
    rating: number;
    createdAt: string;
}

export default function StudioDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const { data: session } = authClient.useSession();

    const [studio, setStudio] = useState<Studio | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Booking Modal
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [bookingData, setBookingData] = useState({
        userName: "",
        userEmail: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
    });

    // Auto-fill user details from session
    useEffect(() => {
        if (session?.user) {
            setBookingData((prev) => ({
                ...prev,
                userName: session.user.name || "",
                userEmail: session.user.email || "",
            }));
        }
    }, [session]);

    // Fetch Studio Details
    useEffect(() => {
        const fetchStudio = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `https://studiospace-server-sayed-cbee.vercel.app/api/studios/${id}`
                );

                if (!response.ok) {
                    throw new Error("Studio not found.");
                }

                const data = await response.json();
                setStudio(data);
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

        if (id) {
            fetchStudio();
        }

    }, [id]);

    // Calculate Booking Price
    const calculateTotal = () => {
        if (!studio || !bookingData.startTime || !bookingData.endTime) {
            return 0;
        }

        const [startHour, startMinute] = bookingData.startTime
            .split(":")
            .map(Number);

        const [endHour, endMinute] = bookingData.endTime
            .split(":")
            .map(Number);

        const start = startHour * 60 + startMinute;
        const end = endHour * 60 + endMinute;

        if (end <= start) return 0;

        const hours = (end - start) / 60;

        return hours * studio.hourlyRate;
    };

    // Handle Booking
    const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!studio) return;

        const totalPrice = calculateTotal();

        if (totalPrice <= 0) {
            toast.error("Please select a valid booking time.");
            return;
        }

        try {
            setBookingLoading(true);

            const response = await fetch(
                "https://studiospace-server-sayed-cbee.vercel.app/api/bookings",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        studioId: studio._id,
                        studioTitle: studio.title,
                        bookingDate: bookingData.bookingDate,
                        startTime: bookingData.startTime,
                        endTime: bookingData.endTime,
                        totalPrice,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Booking failed.");
            }

            toast.success("Your booking request has been submitted!");

            setShowBookingModal(false);

            // Reset only time fields, keep name and email
            setBookingData((prev) => ({
                ...prev,
                bookingDate: "",
                startTime: "",
                endTime: "",
            }));
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Booking failed."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fafaf7] dark:bg-[#111111]">
                <div className="flex items-center gap-3 text-gray-500">
                    <LoaderCircle className="animate-spin" size={24} />
                    Loading studio details...
                </div>
            </div>
        );
    }

    // Error State
    if (error || !studio) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf7] px-5 text-center dark:bg-[#111111]">
                <Camera size={45} className="mb-5 text-gray-400" />

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Studio Not Found
                </h2>

                <p className="mt-3 text-gray-500 dark:text-gray-400">
                    {error || "The studio you are looking for does not exist."}
                </p>

                <button
                    onClick={() => router.push("/studios")}
                    className="mt-7 flex items-center gap-2 rounded-xl bg-[#c7f36b] px-6 py-3 font-semibold text-[#171717]"
                >
                    <ArrowLeft size={18} />
                    Back to Studios
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf7] px-5 pb-24 pt-10 text-[#171717] dark:bg-[#111111] dark:text-white md:px-10">
            <div className="mx-auto max-w-7xl">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#8bb52e]"
                >
                    <ArrowLeft size={18} />
                    Back to Studios
                </button>

                {/* Main Image */}
                <div className="relative">

                    <GalleryCarousel
                        images={studio.imageUrls}
                        imageUrl={studio.imageUrl}
                        title={studio.title}
                    />

                    {/* Category Badge */}
                    <div className="absolute bottom-5 left-5 z-10 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg">
                        {studio.category}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg">
                        <Star
                            size={17}
                            className="fill-yellow-400 text-yellow-400"
                        />
                        {Number(studio.rating || 0).toFixed(1)}
                    </div>
                </div>

                {/* Studio Content */}
                <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">

                    {/* Left Content */}
                    <div>
                        {/* Title */}
                        <div className="border-b border-gray-200 pb-8 dark:border-gray-800">
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8cae3c]">
                                Creative Workspace
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                                {studio.title}
                            </h1>

                            <div className="mt-5 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin size={18} />
                                {studio.location}
                            </div>
                        </div>

                        {/* Studio Specifications */}
                        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-8 dark:border-gray-800 md:grid-cols-3">

                            <div className="rounded-2xl bg-white p-5 dark:bg-[#1c1c1c]">
                                <Clock className="mb-3 text-[#8cae3c]" size={23} />

                                <p className="text-xs text-gray-500">
                                    Hourly Rate
                                </p>

                                <h3 className="mt-1 text-xl font-bold">
                                    ${studio.hourlyRate}
                                </h3>
                            </div>

                            <div className="rounded-2xl bg-white p-5 dark:bg-[#1c1c1c]">
                                <ShieldCheck className="mb-3 text-[#8cae3c]" size={23} />

                                <p className="text-xs text-gray-500">
                                    Security Deposit
                                </p>

                                <h3 className="mt-1 text-xl font-bold">
                                    ${studio.securityDeposit}
                                </h3>
                            </div>

                            <div className="rounded-2xl bg-white p-5 dark:bg-[#1c1c1c]">
                                <Users className="mb-3 text-[#8cae3c]" size={23} />

                                <p className="text-xs text-gray-500">
                                    Max Capacity
                                </p>

                                <h3 className="mt-1 text-xl font-bold">
                                    {studio.maxCapacity} People
                                </h3>
                            </div>

                        </div>

                        {/* Overview */}
                        <section className="border-b border-gray-200 py-9 dark:border-gray-800">
                            <h2 className="mb-5 text-2xl font-bold">
                                About This Space
                            </h2>

                            <p className="max-w-3xl text-sm leading-8 text-gray-600 dark:text-gray-400">
                                {studio.overview}
                            </p>
                        </section>

                        {/* Amenities */}
                        <section className="border-b border-gray-200 py-9 dark:border-gray-800">
                            <h2 className="mb-6 text-2xl font-bold">
                                What This Studio Offers
                            </h2>

                            {studio.amenities?.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {studio.amenities.map((amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7f36b]/20 text-[#8cae3c]">
                                                <Check size={17} />
                                            </span>

                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No amenities listed yet.
                                </p>
                            )}
                        </section>

                        {/* Host Details */}
                        <section className="border-b border-gray-200 py-9 dark:border-gray-800">
                            <h2 className="mb-6 text-2xl font-bold">
                                Meet Your Host
                            </h2>

                            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 dark:bg-[#1c1c1c]">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c7f36b] text-[#171717]">
                                    <Users size={25} />
                                </div>

                                <div>
                                    <h3 className="font-bold">
                                        {studio.ownerName}
                                    </h3>

                                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Mail size={14} />
                                        {studio.ownerEmail}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Reviews */}
                        <section className="py-9">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold">
                                    Guest Reviews
                                </h2>

                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Star
                                        size={15}
                                        className="fill-yellow-400 text-yellow-400"
                                    />
                                    {Number(studio.rating || 0).toFixed(1)}
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 py-10 text-center dark:border-gray-700">
                                <Star
                                    size={30}
                                    className="mx-auto mb-3 text-gray-400"
                                />

                                <h3 className="font-semibold">
                                    No reviews yet
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Reviews will appear here once guests share their experiences.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Booking Card */}
                    <aside>
                        <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1c1c1c]">
                            <p className="text-sm text-gray-500">
                                Starting from
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                ${studio.hourlyRate}
                                <span className="text-sm font-normal text-gray-500">
                                    {" "}/ hour
                                </span>
                            </h2>

                            <div className="my-6 space-y-4 border-y border-gray-100 py-5 text-sm dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">
                                        Hourly Rate
                                    </span>
                                    <span className="font-semibold">
                                        ${studio.hourlyRate}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">
                                        Security Deposit
                                    </span>
                                    <span className="font-semibold">
                                        ${studio.securityDeposit}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">
                                        Maximum Capacity
                                    </span>
                                    <span className="font-semibold">
                                        {studio.maxCapacity} People
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (!session?.user) {
                                        router.replace(`/login?callbackURL=/studios/${id}`);
                                        return;
                                    }

                                    if (session.user.email === studio.ownerEmail) {
                                        toast.error("You cannot book your own studio.");
                                        return;
                                    }

                                    setShowBookingModal(true);
                                }}
                                className="flex w-full items-center justify-between rounded-xl bg-[#c7f36b] px-5 py-4 text-sm font-bold text-[#171717] transition hover:bg-[#b5e653]"
                            >
                                Book Workspace Now
                                <ArrowRight size={19} />
                            </button>

                            <p className="mt-4 text-center text-xs text-gray-500">
                                Your booking will initially be Pending.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm">
                    <div className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 dark:bg-[#202020] md:p-8">

                        {/* Modal Header */}
                        <div className="mb-7 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8cae3c]">
                                    Reserve Your Space
                                </p>

                                <h2 className="mt-2 text-2xl font-bold">
                                    Book This Studio
                                </h2>
                            </div>

                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-white"
                                aria-label="Close booking modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Booking Form */}
                        <form onSubmit={handleBooking} className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Your Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={bookingData.userName}
                                    onChange={(e) =>
                                        setBookingData({
                                            ...bookingData,
                                            userName: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your name"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#a3cf45] dark:border-gray-700 dark:bg-[#171717]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    readOnly
                                    value={bookingData.userEmail}
                                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm outline-none dark:border-gray-700 dark:bg-[#1a1a1a] text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Booking Date
                                </label>

                                <input
                                    type="date"
                                    required
                                    min={new Date().toLocaleDateString("en-CA")}
                                    value={bookingData.bookingDate}
                                    onChange={(e) =>
                                        setBookingData({
                                            ...bookingData,
                                            bookingDate: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#a3cf45] dark:border-gray-700 dark:bg-[#171717]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        Start Time
                                    </label>

                                    <input
                                        type="time"
                                        required
                                        value={bookingData.startTime}
                                        onChange={(e) =>
                                            setBookingData({
                                                ...bookingData,
                                                startTime: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-[#a3cf45] dark:border-gray-700 dark:bg-[#171717]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold">
                                        End Time
                                    </label>

                                    <input
                                        type="time"
                                        required
                                        value={bookingData.endTime}
                                        onChange={(e) =>
                                            setBookingData({
                                                ...bookingData,
                                                endTime: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-[#a3cf45] dark:border-gray-700 dark:bg-[#171717]"
                                    />
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="flex items-center justify-between rounded-xl bg-[#c7f36b]/20 p-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Estimated Total
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Based on selected hours
                                    </p>
                                </div>

                                <h3 className="text-2xl font-bold">
                                    ${calculateTotal().toFixed(2)}
                                </h3>
                            </div>

                            <button
                                type="submit"
                                disabled={bookingLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c7f36b] py-4 text-sm font-bold text-[#171717] transition hover:bg-[#b5e653] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {bookingLoading ? (
                                    <>
                                        <LoaderCircle className="animate-spin" size={18} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Confirm Booking Request
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
}