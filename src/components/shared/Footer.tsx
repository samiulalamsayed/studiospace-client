'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Aperture,
    ArrowUpRight,
    Mail,
    MapPin,
    ArrowRight,
} from "lucide-react";

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Studios", href: "/studios" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About Us", href: "/#about" },
];

const categories = [
    { label: "Photo Studios", value: "Photo Studio" },
    { label: "Sound Stages", value: "Film Stage" },
    { label: "Podcast Rooms", value: "Podcast Lounge" },
    { label: "Music Suites", value: "Music Suite" },
    { label: "Art Workshops", value: "Workshop" },
];

export default function Footer() {
    const pathname = usePathname();
    const router = useRouter();

    // Smooth Scroll Handler for Footer Links
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
        <footer className="relative mt-20 overflow-hidden bg-[#111111] px-5 pt-24 text-white md:px-10">

            {/* Background Glow Effect */}
            <div className="pointer-events-none absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#8cae3c] opacity-5 blur-[120px]" />
            <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#c7f36b] opacity-[0.03] blur-[100px]" />

            <div className="relative mx-auto max-w-[1440px]">
                {/* Main Footer */}
                <div className="grid gap-12 border-b border-white/10 pb-20 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]">

                    {/* Brand */}
                    <div className="pr-4">
                        <Link href="/" className="group inline-flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c7f36b] text-[#171717] transition-all duration-500 group-hover:-rotate-12 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(199,243,107,0.3)]">
                                <Aperture size={26} strokeWidth={2.5} />
                            </div>

                            <div className="flex flex-col">
                                <h2 className="text-[26px] font-black tracking-tight text-white transition-colors group-hover:text-[#c7f36b]">
                                    Studio<span className="text-[#8cae3c]">Space</span>
                                </h2>
                            </div>
                        </Link>

                        <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-gray-400">
                            A high-performance peer-to-peer marketplace. Discover inspiring studios, connect with hosts, and bring your creative vision to life.
                        </p>

                        {/* Social Links */}
                        <div className="mt-8 flex items-center gap-4">
                            {/* Instagram */}
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c7f36b] hover:bg-[#c7f36b] hover:text-[#111111] hover:shadow-[0_0_15px_rgba(199,243,107,0.4)]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110">
                                    <rect width="20" height="20" x="2" y="2" rx="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="18" cy="6" r="0.5" fill="currentColor" />
                                </svg>
                            </a>

                            {/* Facebook */}
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c7f36b] hover:bg-[#c7f36b] hover:text-[#111111] hover:shadow-[0_0_15px_rgba(199,243,107,0.4)]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:scale-110">
                                    <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.6V3.9c-.8-.1-1.7-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5V10H7v3h2.7v8h3.8Z" />
                                </svg>
                            </a>

                            {/* X (New Twitter Logo) */}
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X"
                                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c7f36b] hover:bg-[#c7f36b] hover:text-[#111111] hover:shadow-[0_0_15px_rgba(199,243,107,0.4)]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:scale-110">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[#8cae3c]">
                            Quick Links
                        </h3>

                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        onClick={(e) => handleScroll(e, link.href)}
                                        className="group inline-flex items-center gap-2 text-[15px] font-medium text-gray-400 transition-colors hover:text-white"
                                    >
                                        <span className="relative overflow-hidden">
                                            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                                                {link.label}
                                            </span>
                                            <span className="absolute left-0 top-0 inline-block translate-y-full text-[#c7f36b] transition-transform duration-300 group-hover:translate-y-0">
                                                {link.label}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[#8cae3c]">
                            Categories
                        </h3>

                        <ul className="space-y-4">
                            {categories.map((category) => (
                                <li key={category.value}>
                                    <Link
                                        href={`/studios?category=${encodeURIComponent(category.value)}`}
                                        className="group inline-flex items-center gap-2 text-[15px] font-medium text-gray-400 transition-all hover:translate-x-1 hover:text-white"
                                    >
                                        <span className="h-[2px] w-0 bg-[#c7f36b] transition-all duration-300 group-hover:w-3" />
                                        {category.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[#8cae3c]">
                            Stay Inspired
                        </h3>

                        <p className="mb-6 text-[15px] leading-relaxed text-gray-400">
                            Get creative inspiration, exclusive offers, and updates about new spaces delivered to your inbox.
                        </p>

                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="group relative flex items-center overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition-all focus-within:bg-white/10 focus-within:ring-[#c7f36b]/50 hover:ring-white/20"
                        >
                            <div className="absolute left-4 text-gray-500 transition-colors group-focus-within:text-[#c7f36b]">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                placeholder="Email address"
                                className="w-full bg-transparent py-4 pl-12 pr-14 text-sm text-white placeholder-gray-500 outline-none"
                            />

                            <button
                                type="submit"
                                aria-label="Subscribe"
                                className="absolute right-1.5 flex h-[calc(100%-12px)] w-12 items-center justify-center rounded-xl bg-[#c7f36b] text-[#111111] transition-all duration-300 hover:bg-white hover:scale-95"
                            >
                                <ArrowUpRight size={20} strokeWidth={2.5} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col-reverse justify-between gap-6 py-8 md:flex-row md:items-center">
                    <p className="text-[13px] font-medium text-gray-500">
                        © {new Date().getFullYear()} StudioSpace. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[13px] font-medium text-gray-500">
                        <Link
                            href="/"
                            className="transition-colors hover:text-white"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/"
                            className="transition-colors hover:text-white"
                        >
                            Terms & Conditions
                        </Link>

                        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-gray-400 ring-1 ring-white/10">
                            <MapPin size={14} className="text-[#8cae3c]" />
                            <span>Made for Creators</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}