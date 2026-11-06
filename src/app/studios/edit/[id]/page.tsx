
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Loader2,
    Save,
    ImagePlus,
    X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const API_URL = "https://studiospace-server-sayed-cbee.vercel.app/api/studios";

const categories = [
    "Photo Studio",
    "Film Stage",
    "Podcast Lounge",
    "Music Suite",
    "Workshop",
];

const availableAmenities = [
    "Lighting",
    "Air Conditioning",
    "Backdrop",
    "Soundproofing",
    "Wi-Fi",
    "Parking",
    "Makeup Room",
    "Furniture",
    "Restroom",
    "Kitchen",
];

interface StudioForm {
    title: string;
    category: string;
    hourlyRate: string;
    securityDeposit: string;
    maxCapacity: string;
    location: string;
    imageUrl: string;
    imageUrls: string[];
    amenities: string[];
    overview: string;
    ownerName: string;
    ownerEmail: string;
}

export default function UpdateStudioPage() {
    const params = useParams();
    const router = useRouter();
    const studioId = params.id as string;

    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const [formData, setFormData] = useState<StudioForm>({
        title: "",
        category: "",
        hourlyRate: "",
        securityDeposit: "",
        maxCapacity: "",
        location: "",
        imageUrl: "",
        imageUrls: [],
        amenities: [],
        overview: "",
        ownerName: "",
        ownerEmail: "",
    });

    // Fetch Studio Information
    useEffect(() => {
        if (sessionLoading) return;

        if (!session) {
            router.replace(`/login?callbackURL=/studios/edit/${studioId}`);
            return;
        }

        const fetchStudio = async () => {
            try {
                const response = await fetch(`${API_URL}/${studioId}`);

                if (!response.ok) {
                    throw new Error("Failed to load studio");
                }

                const studio = await response.json();

                if (studio.ownerEmail !== session.user.email) {
                    toast.error(
                        "You are not authorized to edit this studio."
                    );
                    router.replace("/my-listings");
                    return;
                }

                setFormData({
                    title: studio.title || "",
                    category: studio.category || "",
                    hourlyRate: String(studio.hourlyRate ?? ""),
                    securityDeposit: String(studio.securityDeposit ?? ""),
                    maxCapacity: String(studio.maxCapacity ?? ""),
                    location: studio.location || "",
                    imageUrl: studio.imageUrl || "",
                    imageUrls:
                        Array.isArray(studio.imageUrls) && studio.imageUrls.length > 0
                            ? studio.imageUrls
                            : studio.imageUrl
                                ? [studio.imageUrl]
                                : [],
                    amenities: studio.amenities || [],
                    overview: studio.overview || "",
                    ownerName: studio.ownerName || "",
                    ownerEmail: studio.ownerEmail || "",
                });
            } catch {
                toast.error("Could not load studio information.");
                router.replace("/my-listings");
            } finally {
                setLoading(false);
            }
        };

        fetchStudio();
    }, [session, sessionLoading, studioId, router]);

    // Handle Input Changes
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
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select valid image files.");
                e.target.value = "";
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                toast.error("Each image must be less than 10MB.");
                e.target.value = "";
                return;
            }
        }

        setImageUploading(true);

        try {
            const uploadedUrls = await Promise.all(
                files.map(async (file) => {
                    const uploadData = new FormData();
                    uploadData.append("image", file);

                    const response = await fetch(
                        "https://studiospace-server-sayed-cbee.vercel.app/api/upload",
                        {
                            method: "POST",
                            body: uploadData,
                        }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            result.message || "Image upload failed."
                        );
                    }

                    return result.imageUrl as string;
                })
            );

            setFormData((prev) => {
                const updatedImages = [
                    ...prev.imageUrls,
                    ...uploadedUrls,
                ];

                return {
                    ...prev,
                    imageUrls: updatedImages,
                    imageUrl: prev.imageUrl || updatedImages[0],
                };
            });

            toast.success("Images uploaded successfully!");
        } catch (error) {
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

    // Handle Amenity Changes
    const handleAmenityChange = (amenity: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((item) => item !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    // Handle Studio Update
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!session) {
            toast.error("Please login first.");
            return;
        }

        if (formData.imageUrls.length === 0) {
            toast.error("Please upload at least one studio image.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/${studioId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: formData.title,
                    category: formData.category,
                    hourlyRate: Number(formData.hourlyRate),
                    securityDeposit: Number(formData.securityDeposit),
                    maxCapacity: Number(formData.maxCapacity),
                    location: formData.location,
                    imageUrl: formData.imageUrls[0],
                    imageUrls: formData.imageUrls,
                    amenities: formData.amenities,
                    overview: formData.overview,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update studio"
                );
            }

            toast.success("Studio updated successfully!");
            router.push("/my-listings");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass =
        "form-input w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white";

    if (loading || sessionLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-lime-500" />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/my-listings"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-lime-600"
                >
                    <ArrowLeft size={16} />
                    Back to My Listings
                </Link>

                <div className="mb-8">
                    <span className="text-sm font-semibold uppercase tracking-widest text-lime-600">
                        Studio Management
                    </span>

                    <h1 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
                        Update Your Studio
                    </h1>

                    <p className="mt-2 text-sm text-neutral-500">
                        Make changes to your studio listing.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-7 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8"
                >
                    {/* Basic Information */}
                    <div>
                        <h2 className="mb-5 text-lg font-semibold text-neutral-900 dark:text-white">
                            Basic Information
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Studio Title
                                </label>

                                <input
                                    required
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter studio title"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Category
                                </label>

                                <select
                                    required
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Hourly Rate ($)
                                    </label>

                                    <input
                                        required
                                        min="1"
                                        type="number"
                                        name="hourlyRate"
                                        value={formData.hourlyRate}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Security Deposit ($)
                                    </label>

                                    <input
                                        required
                                        min="0"
                                        type="number"
                                        name="securityDeposit"
                                        value={formData.securityDeposit}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Maximum Capacity
                                </label>

                                <input
                                    required
                                    min="1"
                                    type="number"
                                    name="maxCapacity"
                                    value={formData.maxCapacity}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Location
                                </label>

                                <input
                                    required
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter studio location"
                                />
                            </div>

                            {/* Studio Image Upload */}
                            <div>
                                <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
                                    Studio Images
                                </h2>

                                <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
                                    Upload multiple studio images or remove existing images.
                                </p>

                                {/* Image Preview */}
                                {formData.imageUrls.length > 0 && (
                                    <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                        {formData.imageUrls.map((image, index) => (
                                            <div
                                                key={`${image}-${index}`}
                                                className="group relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700"
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Studio image ${index + 1}`}
                                                    className="h-36 w-full object-cover"
                                                />

                                                {index === 0 && (
                                                    <span className="absolute bottom-2 left-2 rounded-md bg-lime-400 px-2 py-1 text-xs font-semibold text-neutral-950">
                                                        Main Image
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData((prev) => {
                                                            const updatedImages = prev.imageUrls.filter(
                                                                (_, i) => i !== index
                                                            );

                                                            return {
                                                                ...prev,
                                                                imageUrls: updatedImages,
                                                                imageUrl: updatedImages[0] || "",
                                                            };
                                                        });
                                                    }}
                                                    className="absolute right-2 top-2 rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 transition hover:border-lime-400 dark:border-neutral-700 dark:bg-neutral-950">
                                    {imageUploading ? (
                                        <>
                                            <Loader2
                                                size={32}
                                                className="animate-spin text-lime-500"
                                            />

                                            <p className="mt-3 text-sm text-neutral-500">
                                                Uploading images...
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <ImagePlus
                                                size={32}
                                                className="text-neutral-400"
                                            />

                                            <p className="mt-3 text-sm font-semibold">
                                                Click to upload images
                                            </p>

                                            <p className="mt-1 text-xs text-neutral-500">
                                                Select multiple PNG, JPG, WEBP images (Maximum 10MB each)
                                            </p>
                                        </>
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
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
                            Amenities
                        </h2>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {availableAmenities.map((amenity) => (
                                <label
                                    key={amenity}
                                    className="flex cursor-pointer items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() =>
                                            handleAmenityChange(amenity)
                                        }
                                        className="h-4 w-4 accent-lime-500"
                                    />

                                    {amenity}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Overview */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Detailed Overview
                        </label>

                        <textarea
                            required
                            rows={5}
                            name="overview"
                            value={formData.overview}
                            onChange={handleChange}
                            className={`${inputClass} resize-none`}
                            placeholder="Describe your studio..."
                        />
                    </div>

                    {/* Host Information */}
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
                            Host Information
                        </h2>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Host Name
                                </label>

                                <input
                                    readOnly
                                    value={formData.ownerName}
                                    className={`${inputClass} cursor-not-allowed opacity-60`}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Host Email
                                </label>

                                <input
                                    readOnly
                                    value={formData.ownerEmail}
                                    className={`${inputClass} cursor-not-allowed opacity-60`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Update Button */}
                    <button
                        type="submit"
                        disabled={
                            submitting ||
                            imageUploading ||
                            formData.imageUrls.length === 0
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 font-semibold text-neutral-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Update Studio
                            </>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}

