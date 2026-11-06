import Link from "next/link";
import {
    ArrowUpRight,
    Camera,
    Clapperboard,
    Mic2,
    Music2,
    Palette,
} from "lucide-react";

const categories = [
    {
        name: "Photo Studios",
        value: "Photo Studio",
        description: "Capture moments with the perfect lighting and setup.",
        image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
        icon: Camera,
        number: "01",
    },
    {
        name: "Sound Stages",
        value: "Film Stage",
        description: "Bring your film and video productions to life.",
        image:
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85",
        icon: Clapperboard,
        number: "02",
    },
    {
        name: "Podcast Rooms",
        value: "Podcast Lounge",
        description: "Find your voice in a professional recording space.",
        image:
            "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=85",
        icon: Mic2,
        number: "03",
    },
    {
        name: "Music Suites",
        value: "Music Suite",
        description: "Create, record and produce your next masterpiece.",
        image:
            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=85",
        icon: Music2,
        number: "04",
    },
    {
        name: "Art Workshops",
        value: "Workshop",
        description: "Discover inspiring spaces for artistic expression.",
        image:
            "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",
        icon: Palette,
        number: "05",
    },
];

export default function Categories() {
    return (
        <section className="bg-[#fafaf7] px-5 py-24 dark:bg-[#111111] sm:py-32 md:px-10">
            <div className="mx-auto max-w-[1440px]">

                {/* Section Header */}
                <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        {/* Eyebrow */}
                        <div className="mb-6 flex items-center gap-4">
                            <span className="flex h-1.5 w-8 rounded-full bg-[#c7f36b]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                                Explore Possibilities
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-[36px] font-black leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:text-[42px] md:text-[52px]">
                            Find your creative <br className="hidden sm:block" />
                            <span className="relative inline-block">
                                <span className="relative z-10 text-gray-400 dark:text-gray-500">space.</span>
                                {/* Highlight underline effect */}
                                <span className="absolute bottom-1 left-0 -z-0 h-3 w-full -rotate-1 rounded-sm bg-[#c7f36b]/40 opacity-50 blur-[2px]" />
                            </span>
                        </h2>
                    </div>

                    {/* Description */}
                    <div className="max-w-md md:pb-3">
                        <p className="text-[15px] font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                            Every great idea deserves the right environment. Explore
                            specialized spaces designed and equipped to help you create something extraordinary.
                        </p>
                    </div>
                </div>

                {/* Grid Layout Container */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {categories.map((category, index) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.value}
                                href={`/studios?category=${encodeURIComponent(category.value)}`}
                                // First two items span multiple columns on tablet/desktop for a dynamic bento-box feel
                                className={`group relative flex h-[380px] w-full flex-col overflow-hidden rounded-[32px] bg-gray-900 shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(199,243,107,0.2)] hover:ring-[#c7f36b]/50 dark:ring-white/10 ${index === 0 ? "sm:col-span-2 lg:col-span-2 xl:col-span-2" :
                                        index === 1 ? "sm:col-span-2 lg:col-span-1 xl:col-span-3" :
                                            "sm:col-span-1 lg:col-span-1 xl:col-span-1"
                                    }`}
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                    style={{
                                        backgroundImage: `url('${category.image}')`,
                                    }}
                                />

                                {/* Complex Gradient Overlays for perfect text contrast */}
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />
                                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-50" />

                                {/* Card Content (Z-20 keeps it above gradients) */}
                                <div className="relative z-20 flex h-full flex-col justify-between p-8">

                                    {/* Top Section: Number & Icon */}
                                    <div className="flex items-start justify-between">
                                        <span className="font-mono text-[13px] font-bold tracking-widest text-white/50">
                                            {category.number} <span className="text-white/20">/ 05</span>
                                        </span>

                                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-md transition-all duration-300 group-hover:-rotate-12 group-hover:border-[#c7f36b] group-hover:bg-[#c7f36b] group-hover:text-[#111111] group-hover:shadow-[0_0_20px_rgba(199,243,107,0.4)]">
                                            <Icon size={24} strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    {/* Bottom Section: Text & Action */}
                                    <div className="mt-auto transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                                        <h3 className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-[#c7f36b] md:text-[28px]">
                                            {category.name}
                                        </h3>

                                        <p className="mt-3 max-w-[280px] text-[14px] font-medium leading-relaxed text-gray-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:opacity-100">
                                            {category.description}
                                        </p>

                                        {/* Action Link (Fades in and slides up on hover) */}
                                        <div className="mt-6 flex items-center gap-2 overflow-hidden text-[13px] font-black uppercase tracking-wider text-[#c7f36b]">
                                            <span className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                Explore Spaces
                                            </span>
                                            <ArrowUpRight
                                                size={18}
                                                strokeWidth={3}
                                                className="translate-y-4 opacity-0 transition-all duration-300 delay-75 group-hover:translate-y-0 group-hover:translate-x-1 group-hover:opacity-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}