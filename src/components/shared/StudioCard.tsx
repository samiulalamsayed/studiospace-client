import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";

export interface Studio {
    _id: string;
    title: string;
    category: string;
    hourlyRate: number;
    location: string;
    imageUrl: string;
    rating: number;
}

interface StudioCardProps {
    studio: Studio;
}

export default function StudioCard({ studio }: StudioCardProps) {
    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200/60 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-[#c7f36b]/50 hover:shadow-[0_20px_40px_-15px_rgba(199,243,107,0.15)] dark:border-white/5 dark:bg-[#151515] dark:hover:border-[#c7f36b]/30">

            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">

                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <img
                    src={studio.imageUrl}
                    alt={studio.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Top Badges */}
                <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
                    {/* Category Badge */}
                    <span className="inline-flex items-center rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-black tracking-wider text-gray-900 shadow-sm backdrop-blur-md">
                        {studio.category}
                    </span>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[12px] font-bold text-white shadow-sm backdrop-blur-md">
                        <Star
                            size={12}
                            className="fill-[#c7f36b] text-[#c7f36b]"
                        />
                        {Number(studio.rating || 0).toFixed(1)}
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-1 flex-col p-5">

                {/* Location */}
                <div className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-gray-500 transition-colors group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
                    <MapPin size={14} className="text-[#8cae3c]" />
                    <span className="line-clamp-1">{studio.location}</span>
                </div>

                {/* Title */}
                <h3 className="mb-4 line-clamp-1 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#8cae3c] dark:text-white">
                    {studio.title}
                </h3>

                {/* Spacer to push pricing and button to bottom if titles are different lengths */}
                <div className="flex-1" />

                {/* Pricing & Action */}
                <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-5 dark:border-white/10">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Starting from
                        </p>
                        <p className="mt-0.5 flex items-baseline gap-1 text-2xl font-black text-gray-900 dark:text-white">
                            ${studio.hourlyRate}
                            <span className="text-sm font-medium text-gray-500">
                                /hr
                            </span>
                        </p>
                    </div>

                    <Link
                        href={`/studios/${studio._id}`}
                        aria-label={`View details for ${studio.title}`}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c7f36b] text-[#111111] transition-all duration-300 hover:scale-105 hover:bg-[#b5e653] group-hover:shadow-[0_0_20px_rgba(199,243,107,0.4)]"
                    >
                        <ArrowUpRight
                            size={22}
                            strokeWidth={2.5}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </Link>
                </div>
            </div>

            {/* Full Card Clickable Area Overlay (Optional but good for UX) */}
            <Link
                href={`/studios/${studio._id}`}
                className="absolute inset-0 z-0"
                aria-hidden="true"
            >
                <span className="sr-only">View {studio.title} details</span>
            </Link>
        </article>
    );
}