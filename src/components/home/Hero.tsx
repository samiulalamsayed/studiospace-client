"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, PlayCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
    {
        subtitle: "YOUR SPACE. YOUR CREATIVITY.",
        title: "Find the perfect space to create.",
        description:
            "Discover inspiring studios and creative spaces designed to bring your ideas to life.",
        image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=85",
        label: "Creative Workspaces",
    },
    {
        subtitle: "MAKE EVERY FRAME COUNT.",
        title: "Where great stories come to life.",
        description:
            "Explore professional photography studios and film production spaces for your next project.",
        image:
            "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=2000&q=85",
        label: "Photography & Film",
    },
    {
        subtitle: "TURN IDEAS INTO SOUND.",
        title: "Create something worth listening to.",
        description:
            "Find podcast rooms, music studios and sound-ready spaces for your creative journey.",
        image:
            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=85",
        label: "Music & Podcast Studios",
    },
];

export default function Hero() {
    const pathname = usePathname();
    const router = useRouter();

    // Smooth Scroll Handler for Hero buttons
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
        if (href.startsWith("/#")) {
            const targetId = href.replace("/#", "");
            if (pathname === "/") {
                e.preventDefault();
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                e.preventDefault();
                router.push(href);
            }
        }
    };

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-[#111111] md:h-[90vh] md:min-h-[700px]">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                speed={1000}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                loop
                className="studio-hero-swiper h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative flex h-full w-full items-center">
                            
                            {/* Background Image with Zoom Effect */}
                            <div
                                className="absolute inset-0 transform bg-cover bg-center transition-transform duration-[10000ms] ease-linear hover:scale-110"
                                style={{
                                    backgroundImage: `url('${slide.image}')`,
                                }}
                            />

                            {/* Refined Gradient Overlays for better text visibility */}
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent md:w-3/4" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Content Container */}
                            <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
                                <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                    
                                    {/* Subtitle Badge */}
                                    <div className="mb-6 flex items-center gap-3">
                                        <span className="flex h-6 items-center rounded-full bg-[#c7f36b]/20 px-3 py-1">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c7f36b]" />
                                        </span>
                                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c7f36b] drop-shadow-md">
                                            {slide.subtitle}
                                        </p>
                                    </div>

                                    {/* Main Title */}
                                    <h1 className="text-[40px] font-black leading-[1.05] tracking-tight text-white drop-shadow-xl sm:text-5xl md:text-6xl lg:text-[76px]">
                                        {slide.title}
                                    </h1>

                                    {/* Description */}
                                    <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-gray-300 drop-shadow-md md:text-lg">
                                        {slide.description}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="mt-10 flex flex-wrap items-center gap-4">
                                        <Link
                                            href="/studios"
                                            className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-[#c7f36b] px-8 py-4 text-[15px] font-bold text-[#111111] shadow-[0_0_20px_rgba(199,243,107,0.3)] transition-all hover:scale-105 hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                        >
                                            <span className="relative z-10">Explore Studios</span>
                                            <ArrowUpRight
                                                size={20}
                                                strokeWidth={2.5}
                                                className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                            />
                                        </Link>

                                        <Link
                                            href="/#how-it-works"
                                            onClick={(e) => handleScroll(e, "/#how-it-works")}
                                            className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-[15px] font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#111111]"
                                        >
                                            <PlayCircle size={20} className="transition-colors" />
                                            How It Works
                                        </Link>
                                    </div>
                                </div>

                                {/* Slide Indicator / Label (Desktop only) */}
                                <div className="absolute bottom-12 right-5 hidden md:right-12 lg:block">
                                    <div className="flex flex-col items-end border-r-2 border-[#c7f36b] pr-4">
                                        <p className="font-mono text-xs font-bold tracking-[0.2em] text-[#c7f36b]">
                                            0{index + 1} / 0{slides.length}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold tracking-wide text-white">
                                            {slide.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Global Styles for Swiper Pagination */}
            <style jsx global>{`
                .studio-hero-swiper .swiper-pagination {
                    bottom: 40px !important;
                    text-align: left;
                    padding-left: max(calc((100% - 1440px) / 2 + 20px), 20px);
                    z-index: 50;
                }

                @media (min-width: 640px) {
                    .studio-hero-swiper .swiper-pagination {
                        padding-left: max(calc((100% - 1440px) / 2 + 32px), 32px);
                    }
                }

                @media (min-width: 1024px) {
                    .studio-hero-swiper .swiper-pagination {
                        padding-left: max(calc((100% - 1440px) / 2 + 48px), 48px);
                    }
                }

                .studio-hero-swiper .swiper-pagination-bullet {
                    width: 32px;
                    height: 4px;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.3);
                    opacity: 1;
                    margin: 0 4px !important;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(4px);
                }

                .studio-hero-swiper .swiper-pagination-bullet:hover {
                    background: rgba(255, 255, 255, 0.6);
                }

                .studio-hero-swiper .swiper-pagination-bullet-active {
                    width: 56px;
                    background: #c7f36b;
                    box-shadow: 0 0 10px rgba(199, 243, 107, 0.5);
                }
            `}</style>
        </section>
    );
}