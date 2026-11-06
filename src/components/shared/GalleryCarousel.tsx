"use client";

import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
} from "lucide-react";

interface GalleryCarouselProps {
    images?: string[];
    imageUrl?: string;
    title?: string;
}

export default function GalleryCarousel({
    images = [],
    imageUrl = "",
    title = "Studio",
}: GalleryCarouselProps) {

    // Support both old and new studio data
    const galleryImages = images.length > 0
        ? images
        : imageUrl
            ? [imageUrl]
            : [];

    const [activeIndex, setActiveIndex] = useState(0);

    const previousImage = () => {
        setActiveIndex((prev) =>
            prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    };

    const nextImage = () => {
        setActiveIndex((prev) =>
            prev === galleryImages.length - 1 ? 0 : prev + 1
        );
    };

    if (galleryImages.length === 0) {
        return (
            <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-gray-100 dark:bg-[#1c1c1c]">
                <div className="text-center text-gray-400">
                    <ImageIcon size={40} className="mx-auto mb-2" />
                    <p className="text-sm">No images available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">

            {/* Main Image */}
            <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 dark:bg-[#1c1c1c]">

                <img
                    key={galleryImages[activeIndex]}
                    src={galleryImages[activeIndex]}
                    alt={`${title} - Image ${activeIndex + 1}`}
                    className="h-full w-full object-cover transition duration-500"
                />

                {/* Image Counter */}
                <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {activeIndex + 1} / {galleryImages.length}
                </div>

                {/* Navigation Buttons */}
                {galleryImages.length > 1 && (
                    <>
                        <button
                            onClick={previousImage}
                            aria-label="Previous image"
                            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <ChevronLeft size={22} />
                        </button>

                        <button
                            onClick={nextImage}
                            aria-label="Next image"
                            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <ChevronRight size={22} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Images */}
            {galleryImages.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">

                    {galleryImages.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`View image ${index + 1}`}
                            className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${activeIndex === index
                                    ? "border-[#c7f36b] opacity-100"
                                    : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            <img
                                src={image}
                                alt={`${title} thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}

                </div>
            )}

        </div>
    );
}