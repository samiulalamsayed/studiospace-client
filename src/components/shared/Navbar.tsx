"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
    Aperture,
    Menu,
    X,
    ArrowUpRight,
    ChevronDown,
    Sun,
    Moon,
    User,
    LayoutDashboard,
    PlusCircle,
    Building2,
    CalendarDays,
    LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about" },
];

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: session, isPending } = authClient.useSession();

    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const user = session?.user;

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        if (href.startsWith("/#")) return false; // Hash links are not "active" pages
        return pathname.startsWith(href);
    };

    // Click Outside to close Dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Theme Initialization
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const initialTheme = savedTheme || "light";
        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, []);

    // Theme Toggle
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    // Logout
    const handleLogout = async () => {
        try {
            await fetch("https://studiospace-server-sayed-cbee.vercel.app/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Server logout error:", error);
        }

        try {
            await authClient.signOut();

            toast.success("Logged out successfully.");
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Better Auth logout error:", error);
            toast.error("Unable to logout. Please try again.");
        }
    };
    
    // Smooth Scroll Handler
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
        if (href.startsWith("/#")) {
            const targetId = href.replace("/#", "");

            // If already on the homepage, scroll smoothly
            if (pathname === "/") {
                e.preventDefault();
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }
        }
        // Always close mobile menu when a link is clicked
        setIsOpen(false);
    };

    const profileLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Add Studio", href: "/add-studio", icon: PlusCircle },
        { name: "My Listings", href: "/my-listings", icon: Building2 },
        { name: "My Bookings", href: "/my-bookings", icon: CalendarDays },
    ];

    return (
        <header className="sticky top-0 z-[100] w-full border-b border-black/5 bg-white/80 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#111111]/80">
            <nav className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">

                {/* Logo */}
                <Link href="/" className="group flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c7f36b] text-[#171717] shadow-sm transition-all duration-300 group-hover:rotate-12 group-hover:scale-105">
                        <Aperture size={22} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-tight text-[#171717] dark:text-white">
                            Studio<span className="text-[#8cae3c]">Space</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                            Create Without Limits
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleScroll(e, link.href)}
                            className={`group relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${isActive(link.href)
                                ? "bg-gray-100 text-[#171717] dark:bg-white/10 dark:text-white"
                                : "text-gray-500 hover:bg-gray-50 hover:text-[#171717] dark:hover:bg-white/5 dark:hover:text-white"
                                }`}
                        >
                            {link.name}
                            {isActive(link.href) && (
                                <span className="absolute bottom-1 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-[#8cae3c] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-white"
                    >
                        <div className="transition-transform duration-500 group-hover:rotate-45">
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </div>
                    </button>

                    {/* Authentication */}
                    {!isPending && (
                        <>
                            {user ? (
                                <div className="relative hidden lg:block" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white p-1 pr-4 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-[#1a1a1a] dark:hover:border-gray-700"
                                        aria-expanded={isProfileOpen}
                                    >
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent transition-all group-hover:ring-[#c7f36b]"
                                            />
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7f36b] text-[#171717]">
                                                <User size={16} />
                                            </div>
                                        )}
                                        <span className="max-w-[120px] truncate text-sm font-bold text-gray-800 dark:text-gray-200">
                                            {user.name}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? "-rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {/* Desktop Dropdown */}
                                    <div
                                        className={`absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl transition-all duration-200 dark:border-gray-800 dark:bg-[#1c1c1c] dark:shadow-2xl ${isProfileOpen
                                            ? "visible translate-y-0 scale-100 opacity-100"
                                            : "invisible -translate-y-2 scale-95 opacity-0"
                                            }`}
                                    >
                                        <div className="mb-2 flex flex-col items-center justify-center rounded-xl bg-gray-50 px-4 py-4 text-center dark:bg-white/5">
                                            <p className="w-full truncate font-bold text-gray-900 dark:text-white">
                                                {user.name}
                                            </p>
                                            <p className="w-full truncate text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            {profileLinks.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                                                    >
                                                        <Icon size={18} className="text-gray-400 transition-colors group-hover:text-[#8cae3c]" />
                                                        {item.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-2 border-t border-gray-100 pt-2 dark:border-gray-800">
                                            <button
                                                onClick={handleLogout}
                                                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                                            >
                                                <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden items-center gap-4 lg:flex">
                                    <Link
                                        href="/login"
                                        className="text-sm font-bold text-gray-600 transition-colors hover:text-[#8cae3c] dark:text-gray-300 dark:hover:text-[#c7f36b]"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="group flex items-center gap-2 rounded-full bg-[#171717] px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-[#c7f36b] hover:text-[#171717] dark:bg-white dark:text-[#171717]"
                                    >
                                        Become a Host
                                        <ArrowUpRight
                                            size={16}
                                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </Link>
                                </div>
                            )}
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#171717] transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-[#1a1a1a] dark:text-white lg:hidden"
                        aria-label="Toggle menu"
                    >
                        <div className="relative h-5 w-5">
                            <Menu
                                className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                                    }`}
                                size={20}
                            />
                            <X
                                className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                                    }`}
                                size={20}
                            />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Dropdown (Absolute overlay) */}
            <div
                className={`absolute left-0 top-[80px] w-full border-b border-gray-100 bg-white/95 px-5 backdrop-blur-xl transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-[#111111]/95 lg:hidden ${isOpen ? "max-h-[80vh] py-6 opacity-100 shadow-xl" : "max-h-0 overflow-hidden py-0 opacity-0"
                    }`}
            >
                <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleScroll(e, link.href)}
                            className={`rounded-xl px-4 py-3.5 text-sm font-bold transition-colors ${isActive(link.href)
                                ? "bg-[#c7f36b]/20 text-[#8cae3c] dark:bg-[#c7f36b]/10 dark:text-[#c7f36b]"
                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {!isPending && (
                        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
                            {user ? (
                                <>
                                    <div className="mb-2 flex items-center gap-4 px-2">
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="h-12 w-12 rounded-full object-cover shadow-sm"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c7f36b] text-[#171717]">
                                                <User size={20} />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-bold text-gray-900 dark:text-white">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs font-medium text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {profileLinks.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 rounded-xl border border-transparent px-4 py-3.5 text-sm font-semibold text-gray-600 transition-all hover:border-gray-100 hover:bg-gray-50 dark:text-gray-300 dark:hover:border-gray-800 dark:hover:bg-white/5"
                                                >
                                                    <Icon size={18} className="text-[#8cae3c]" />
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                        <button
                                            onClick={handleLogout}
                                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                                        >
                                            <LogOut size={18} />
                                            Log Out Safely
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center rounded-xl border border-gray-200 py-3.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center rounded-xl bg-[#c7f36b] py-3.5 text-sm font-bold text-[#171717] transition-all hover:bg-[#b8e45b]"
                                    >
                                        Become a Host
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;