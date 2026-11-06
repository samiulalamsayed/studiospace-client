"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Aperture,
    ArrowLeft,
    ImagePlus,
    MapPin,
    DollarSign,
    Users,
    Check,
    LoaderCircle,
    Plus,
    X,
    Building2,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";

const categories = [
    "Photo Studio",
    "Film Stage",
    "Podcast Lounge",
    "Music Suite",
    "Workshop",
];

const availableAmenities = [
    "Professional Lighting",
    "Air Conditioning",
    "High-Speed WiFi",
    "Parking",
    "Soundproof Room",
    "Changing Room",
    "Restroom",
    "Kitchen",
    "Backdrop",
    "Photography Equipment",
    "Video Equipment",
    "Furniture",
];

export default function AddStudioPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        hourlyRate: "",
        securityDeposit: "",
        maxCapacity: "",
        location: "",
        imageUrl: "",
        imageUrls: [] as string[],
        amenities: [] as string[],
        overview: "",
    });

    // Redirect unauthenticated users
    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login?callbackURL=/add-studio");
        }
    }, [isPending, session, router]);

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle Multiple Image Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not a valid image.`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 10MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) {
            e.target.value = "";
            return;
        }

        try {
            setImageUploading(true);
            const uploadedUrls = await Promise.all(
                validFiles.map(async (file) => {
                    const uploadData = new FormData();
                    uploadData.append("image", file);

                    const response = await fetch("https://studiospace-server-sayed-cbee.vercel.app/api/upload", {
                        method: "POST",
                        body: uploadData,
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.message || `Failed to upload ${file.name}`);
                    }
                    return data.imageUrl as string;
                })
            );

            setFormData((prev) => {
                const updatedImages = [...prev.imageUrls, ...uploadedUrls];
                return {
                    ...prev,
                    imageUrls: updatedImages,
                    imageUrl: updatedImages[0] || "",
                };
            });

            toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
        } catch (error) {
            console.error("Image Upload Error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Image upload failed."
            );
        } finally {
            setImageUploading(false);
            e.target.value = "";
        }
    };

    // Submit studio
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please log in to add a studio.");
            return;
        }

        if (formData.imageUrls.length === 0) {
            toast.error("Please upload at least one studio image.");
            return;
        }

        if (formData.amenities.length === 0) {
            toast.error("Please select at least one amenity.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("https://studiospace-server-sayed-cbee.vercel.app/api/studios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Essential for JWT Challenge
                body: JSON.stringify({
                    title: formData.title.trim(),
                    category: formData.category,
                    hourlyRate: Number(formData.hourlyRate),
                    securityDeposit: Number(formData.securityDeposit),
                    maxCapacity: Number(formData.maxCapacity),
                    location: formData.location.trim(),
                    imageUrl: formData.imageUrls[0],
                    imageUrls: formData.imageUrls,
                    amenities: formData.amenities,
                    overview: formData.overview.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add studio");
            }

            toast.success("Studio published successfully!");

            router.push("/my-listings");
            router.refresh();

        } catch (error) {
            console.error("Add Studio Error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((item) => item !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    if (isPending || !session) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fafaf7] dark:bg-[#111111]">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                    <LoaderCircle size={40} className="animate-spin text-[#c7f36b]" />
                    <p className="text-sm font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf7] px-4 py-12 dark:bg-[#111111] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1000px]">

                {/* Header */}
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Link
                        href="/"
                        className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#8cae3c]"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c7f36b] text-[#111111] shadow-sm">
                                <Building2 size={28} strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8cae3c]">
                                    Host Dashboard
                                </p>
                                <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900 dark:text-white md:text-4xl">
                                    List Your Space
                                </h1>
                            </div>
                        </div>
                        <p className="max-w-xs text-sm font-medium text-gray-500 dark:text-gray-400">
                            Share your creative environment with our community of creators.
                        </p>
                    </div>
                </div>

                {/* Main Form */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-[32px] border border-gray-200/60 bg-white shadow-sm ring-1 ring-black/5 dark:border-white/5 dark:bg-[#1a1a1a] dark:ring-white/10"
                >
                    <div className="space-y-12 p-6 sm:p-10 md:p-12">

                        {/* Section 1: Basic Information */}
                        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            <div className="mb-8 border-b border-gray-100 pb-4 dark:border-white/5">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    1. Basic Details
                                </h2>
                                <p className="mt-1 text-[14px] text-gray-500 dark:text-gray-400">
                                    The core information about your studio space.
                                </p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-2.5 block text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Studio Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        minLength={3}
                                        maxLength={100}
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g., The Daylight Loft Studio"
                                        className="form-input"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2.5 block text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="form-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-[right_1rem_center] bg-no-repeat pr-10"
                                    >
                                        <option value="" disabled>Select space type</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2.5 block text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Maximum Capacity <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            name="maxCapacity"
                                            required
                                            min="1"
                                            value={formData.maxCapacity}
                                            onChange={handleChange}
                                            placeholder="e.g., 15"
                                            className="form-input pl-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Pricing */}
                        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <div className="mb-8 border-b border-gray-100 pb-4 dark:border-white/5">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    2. Pricing & Location
                                </h2>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2.5 block text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Hourly Rate ($) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            name="hourlyRate"
                                            required
                                            min="1"
                                            step="0.01"
                                            value={formData.hourlyRate}
                                            onChange={handleChange}
                                            placeholder="75.00"
                                            className="form-input pl-12"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2.5 block text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Security Deposit ($) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            name="securityDeposit"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.securityDeposit}
                                            onChange={handleChange}
                                            placeholder="150.00"
                                            className="form-input pl-12"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2.5 block text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Full Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g., 123 Creator Ave, Dhanmondi, Dhaka"
                                            className="form-input pl-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Media */}
                        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <div className="mb-8 border-b border-gray-100 pb-4 dark:border-white/5">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    3. Studio Media
                                </h2>
                                <p className="mt-1 text-[14px] text-gray-500 dark:text-gray-400">
                                    High-quality images increase booking chances by 70%.
                                </p>
                            </div>

                            <label className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 transition-all hover:border-[#c7f36b] hover:bg-[#c7f36b]/5 dark:border-gray-700 dark:bg-white/5 dark:hover:border-[#c7f36b]/50 dark:hover:bg-[#c7f36b]/10 ${imageUploading ? 'pointer-events-none opacity-60' : ''}`}>
                                {imageUploading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <LoaderCircle size={40} className="animate-spin text-[#8cae3c]" />
                                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Uploading media...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform group-hover:-translate-y-1 dark:bg-[#252525] dark:ring-white/10">
                                            <ImagePlus size={28} className="text-gray-400 group-hover:text-[#8cae3c]" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[15px] font-bold text-gray-700 dark:text-gray-200">
                                                Click to upload images
                                            </p>
                                            <p className="mt-1.5 text-xs font-medium text-gray-500">
                                                PNG, JPG or WEBP (Max 10MB)
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={imageUploading}
                                />
                            </label>

                            {formData.imageUrls.length > 0 && (
                                <div className="mt-8">
                                    <p className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Uploaded Media ({formData.imageUrls.length})
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        {formData.imageUrls.map((url, index) => (
                                            <div key={index} className="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10">
                                                <img src={url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />

                                                {index === 0 && (
                                                    <span className="absolute left-2 top-2 rounded-md bg-[#c7f36b] px-2 py-1 text-[10px] font-black uppercase text-black shadow-sm">
                                                        Cover
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
                                                            imageUrl: index === 0 ? (prev.imageUrls[1] || "") : prev.imageUrl
                                                        }));
                                                    }}
                                                    className="absolute right-2 top-2 flex h-8 w-8 translate-y-[-10px] items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-md transition-all hover:bg-red-600 group-hover:translate-y-0 group-hover:opacity-100"
                                                >
                                                    <X size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Section 4: Amenities & Details */}
                        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                            <div className="mb-8 border-b border-gray-100 pb-4 dark:border-white/5">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    4. Amenities & Details
                                </h2>
                            </div>

                            <div className="mb-8">
                                <label className="mb-4 block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Select Available Features <span className="text-red-500">*</span>
                                </label>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {availableAmenities.map((amenity) => {
                                        const isSelected = formData.amenities.includes(amenity);
                                        return (
                                            <button
                                                key={amenity}
                                                type="button"
                                                onClick={() => handleAmenityToggle(amenity)}
                                                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${isSelected
                                                        ? "border-[#c7f36b] bg-[#c7f36b]/10 text-gray-900 dark:text-white"
                                                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-white/5"
                                                    }`}
                                            >
                                                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors ${isSelected
                                                        ? "border-[#c7f36b] bg-[#c7f36b] text-black"
                                                        : "border-gray-300 dark:border-gray-600"
                                                    }`}>
                                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                                </div>
                                                <span className="text-sm font-semibold">{amenity}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Detailed Overview <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="overview"
                                    required
                                    minLength={20}
                                    maxLength={2000}
                                    rows={5}
                                    value={formData.overview}
                                    onChange={handleChange}
                                    placeholder="Describe your space, layout, natural lighting, access instructions, and rules..."
                                    className="form-input resize-y rounded-2xl"
                                />
                                <p className={`mt-2 text-right text-xs font-medium ${formData.overview.length > 1900 ? 'text-orange-500' : 'text-gray-400'}`}>
                                    {formData.overview.length} / 2000
                                </p>
                            </div>
                        </section>

                        {/* Section 5: Host Profile (Read Only) */}
                        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
                            <div className="mb-6 border-b border-gray-100 pb-4 dark:border-white/5">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Host Profile
                                </h2>
                            </div>
                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                                <div className="flex-1">
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Name</label>
                                    <input type="text" readOnly value={user?.name || ""} className="form-input cursor-not-allowed bg-gray-100 opacity-70 dark:bg-white/5" />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
                                    <input type="email" readOnly value={user?.email || ""} className="form-input cursor-not-allowed bg-gray-100 opacity-70 dark:bg-white/5" />
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Submit Footer */}
                    <div className="flex flex-col-reverse gap-4 border-t border-gray-100 bg-gray-50/80 px-6 py-6 dark:border-white/5 dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-10">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-[15px] font-bold text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:bg-[#252525]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || imageUploading || formData.imageUrls.length === 0}
                            className="group flex items-center justify-center gap-2 rounded-xl bg-[#c7f36b] px-10 py-4 text-[15px] font-bold text-[#111111] shadow-lg transition-all hover:bg-[#b8e45b] hover:shadow-[0_0_20px_rgba(199,243,107,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={20} className="animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    Publish Studio
                                    <ArrowUpRight size={20} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Shared Input Styles */}
                <style jsx global>{`
                    .form-input {
                        width: 100%;
                        border: 1px solid #e5e7eb;
                        border-radius: 16px;
                        background: #ffffff;
                        padding: 16px 20px;
                        font-size: 15px;
                        font-weight: 500;
                        color: #111111;
                        outline: none;
                        transition: all 0.2s ease;
                    }

                    .form-input:focus {
                        border-color: #c7f36b;
                        box-shadow: 0 0 0 4px rgba(199, 243, 107, 0.15);
                    }

                    .form-input::placeholder {
                        color: #9ca3af;
                        font-weight: 400;
                    }

                    .dark .form-input {
                        border-color: rgba(255, 255, 255, 0.1);
                        background: #111111;
                        color: #ffffff;
                    }

                    .dark .form-input:focus {
                        border-color: #c7f36b;
                        background: #151515;
                    }

                    .dark .form-input option {
                        background: #1a1a1a;
                        color: #ffffff;
                    }
                `}</style>
            </div>
        </div>
    );
}