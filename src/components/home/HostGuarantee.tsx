import Link from "next/link";
import {
    ShieldCheck,
    BadgeCheck,
    Wrench,
    Headset,
    ArrowUpRight,
    CheckCircle2,
} from "lucide-react";

const guarantees = [
    {
        icon: ShieldCheck,
        title: "Liability Protection",
        description:
            "Book with greater confidence through clear booking policies and transparent rental terms.",
    },
    {
        icon: BadgeCheck,
        title: "Verified Profiles",
        description:
            "Connect with studio hosts through transparent profiles and reliable listing information.",
    },
    {
        icon: Wrench,
        title: "Equipment Safety",
        description:
            "Find spaces with clearly listed amenities and equipment details before making a reservation.",
    },
    {
        icon: Headset,
        title: "24/7 Host Support",
        description:
            "Get support when you need help with your studio booking and creative workspace experience.",
    },
];

export default function HostGuarantee() {
    return (
        <section
            id="about"
            className="relative overflow-hidden bg-white px-5 py-24 dark:bg-[#151515] sm:py-32 md:px-10"
        >
            {/* Background Accent Gradients */}
            <div className="pointer-events-none absolute -left-[20%] top-0 h-[500px] w-[500px] rounded-full bg-[#c7f36b] opacity-[0.03] blur-[120px] dark:opacity-[0.02]" />
            <div className="pointer-events-none absolute -right-[10%] bottom-0 h-[400px] w-[400px] rounded-full bg-[#8cae3c] opacity-[0.04] blur-[100px] dark:opacity-[0.03]" />

            <div className="relative mx-auto max-w-[1440px]">
                <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
                    
                    {/* Left Content */}
                    <div className="max-w-2xl">
                        
                        {/* Eyebrow */}
                        <div className="mb-6 flex items-center gap-4">
                            <span className="flex h-1.5 w-8 rounded-full bg-[#c7f36b]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                                Your Trust Matters
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-[36px] font-black leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:text-[42px] md:text-[52px]">
                            Create with confidence. <br className="hidden sm:block" />
                            <span className="text-gray-400 dark:text-gray-500">
                                We've got your back.
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mt-8 text-[16px] font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                            Your creative journey deserves a space where you can
                            focus on what matters most. StudioSpace aims to make
                            discovering and booking creative workspaces a more
                            transparent and comfortable experience.
                        </p>

                        {/* Feature List */}
                        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {[
                                "Transparent studio information",
                                "Clear booking and rental details",
                                "Direct connection with studio hosts",
                                "Verified platform reviews"
                            ].map((item) => (
                                <div key={item} className="group flex items-center gap-3">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c7f36b]/20 text-[#8cae3c] transition-colors group-hover:bg-[#c7f36b] group-hover:text-[#111111] dark:bg-[#c7f36b]/10">
                                        <CheckCircle2 size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-[15px] font-semibold text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Action Button */}
                        <Link
                            href="/studios"
                            className="group mt-12 inline-flex items-center gap-3 rounded-full bg-[#111111] px-8 py-4 text-[15px] font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#c7f36b] hover:text-[#111111] hover:shadow-[0_0_20px_rgba(199,243,107,0.4)] dark:bg-white dark:text-[#111111]"
                        >
                            Explore Studios
                            <ArrowUpRight
                                size={20}
                                strokeWidth={2.5}
                                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>

                    {/* Right Content - Fix: Increased gap and corrected staggered logic */}
                    <div className="grid gap-6 pb-12 sm:grid-cols-2 lg:gap-8 lg:pb-0">
                        {guarantees.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className={`group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-gray-200/60 bg-gray-50/50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#c7f36b]/50 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(199,243,107,0.15)] dark:border-white/5 dark:bg-[#1a1a1a] dark:hover:border-[#c7f36b]/30 dark:hover:bg-[#202020] ${
                                        index % 2 !== 0 // Fix: Only stagger the items in the second column
                                            ? "sm:translate-y-12"
                                            : ""
                                    }`}
                                >
                                    {/* Icon Container */}
                                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:-rotate-12 group-hover:bg-[#c7f36b] group-hover:text-[#111111] group-hover:shadow-[0_0_20px_rgba(199,243,107,0.4)] group-hover:ring-[#c7f36b] dark:bg-white/5 dark:ring-white/10">
                                        <Icon size={24} strokeWidth={2.5} />
                                    </div>

                                    {/* Text Content */}
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#8cae3c] dark:text-white">
                                            {item.title}
                                        </h3>
                                        <p className="mt-3 text-[14px] font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                </div>
            </div>
        </section>
    );
}