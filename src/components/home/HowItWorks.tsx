import Link from "next/link";
import {
    Search,
    CalendarDays,
    CreditCard,
    Sparkles,
    ArrowUpRight,
    ArrowRight,
} from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Discover Spaces",
        description:
            "Explore a curated collection of creative studios and find the perfect space for your project.",
        icon: Search,
    },
    {
        number: "02",
        title: "Select Shoot Hours",
        description:
            "Choose your preferred date, check availability and select the hours that work for you.",
        icon: CalendarDays,
    },
    {
        number: "03",
        title: "Book Instantly",
        description:
            "Submit your booking request and manage your reservation with a simple booking process.",
        icon: CreditCard,
    },
    {
        number: "04",
        title: "Create & Produce",
        description:
            "Show up, bring your ideas to life and make something extraordinary in your chosen space.",
        icon: Sparkles,
    },
];

export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative bg-[#fafaf7] px-5 py-24 dark:bg-[#111111] sm:py-32 md:px-10"
        >
            {/* Subtle background grid pattern */}
            <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/grid-dark.svg')] opacity-10" />

            <div className="relative z-10 mx-auto max-w-[1440px]">
                
                {/* Heading */}
                <div className="mx-auto mb-20 max-w-3xl text-center">
                    {/* Eyebrow */}
                    <div className="mb-6 flex items-center justify-center gap-4">
                        <span className="h-[2px] w-6 rounded-full bg-[#c7f36b]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                            Simple Process
                        </span>
                        <span className="h-[2px] w-6 rounded-full bg-[#c7f36b]" />
                    </div>

                    <h2 className="text-[36px] font-black leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:text-[42px] md:text-[52px]">
                        From discovery to{" "}
                        <span className="text-gray-400 dark:text-gray-500">creation.</span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-[16px] font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                        Finding and booking your perfect creative space shouldn't
                        be complicated. Here's how StudioSpace makes it simple.
                    </p>
                </div>

                {/* Steps Container */}
                <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    
                    {/* Background Connector Line (Desktop Only) */}
                    <div className="absolute left-0 top-[88px] hidden h-[2px] w-[calc(100%-100px)] border-t-2 border-dashed border-gray-200 dark:border-white/10 lg:block" />

                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="group relative flex flex-col rounded-[32px] border border-gray-200/60 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#c7f36b]/50 hover:shadow-[0_20px_40px_-15px_rgba(199,243,107,0.15)] dark:border-white/5 dark:bg-[#1a1a1a] dark:hover:border-[#c7f36b]/30"
                            >
                                {/* Top: Number and Icon Container */}
                                <div className="mb-10 flex items-center justify-between">
                                    <span className="font-mono text-[14px] font-bold tracking-widest text-gray-300 transition-colors group-hover:text-gray-400 dark:text-gray-600 dark:group-hover:text-gray-500">
                                        {step.number}
                                    </span>

                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-[#c7f36b] group-hover:text-[#111111] group-hover:shadow-[0_0_20px_rgba(199,243,107,0.4)] group-hover:ring-[#c7f36b] dark:bg-white/5 dark:ring-white/10">
                                        {/* Pulse effect ring behind icon on hover */}
                                        <div className="absolute inset-0 rounded-2xl bg-[#c7f36b] opacity-0 transition-all duration-500 group-hover:animate-ping group-hover:opacity-20" />
                                        <Icon size={26} strokeWidth={2.5} className="relative z-10" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#8cae3c] dark:text-white">
                                        {step.title}
                                    </h3>

                                    <p className="mt-3 text-[14px] font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Bottom Indicator */}
                                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-white/10">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 transition-colors group-hover:text-[#8cae3c]">
                                        Step {step.number}
                                    </span>

                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-[#c7f36b] group-hover:text-[#111111] dark:bg-white/5 dark:text-gray-500">
                                        <ArrowUpRight size={16} strokeWidth={2.5} />
                                    </div>
                                </div>

                                {/* Mobile/Tablet Connector Arrow */}
                                {index !== steps.length - 1 && (
                                    <div className="absolute -bottom-[20px] left-1/2 z-10 -translate-x-1/2 rotate-90 text-gray-200 dark:text-white/10 sm:block lg:hidden">
                                        <ArrowRight size={20} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <div className="mt-20 text-center">
                    <Link
                        href="/studios"
                        className="group inline-flex items-center gap-3 rounded-full bg-[#111111] px-8 py-4 text-[15px] font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#c7f36b] hover:text-[#111111] hover:shadow-[0_0_20px_rgba(199,243,107,0.4)] dark:bg-white dark:text-[#111111]"
                    >
                        Find Your Studio
                        <ArrowUpRight
                            size={20}
                            strokeWidth={2.5}
                            className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                    </Link>
                </div>
                
            </div>
        </section>
    );
}