import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
  Camera,
  Video,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[var(--background)] px-6 py-20">
      <div className="mx-auto w-full max-w-2xl text-center">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-52 w-52 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#c7f36b]/10" />

          <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border border-[#c7f36b]/30 bg-[#c7f36b]/10">
            <Camera size={64} className="text-[#c7f36b]" strokeWidth={1.4} />

            <div className="absolute -right-5 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-black shadow-lg dark:border-gray-700 dark:bg-[#222] dark:text-white">
              <Video size={27} />
            </div>

            <span className="absolute -bottom-5 -left-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#c7f36b] text-xl font-bold text-black">
              ?
            </span>
          </div>
        </div>

        {/* Error Code */}
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#9bc94c]">
          Error 404
        </p>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
          Lost in the <span className="text-[#9bc94c]">Studio?</span>
        </h1>

        <p className="mx-auto mb-9 max-w-md text-base leading-7 text-gray-500 dark:text-gray-400">
          Looks like this creative space doesn't exist or may have been
          moved. Let's get you back to discovering amazing studios.
        </p>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c7f36b] px-7 py-3.5 font-semibold text-black transition hover:bg-[#b5e45a]"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-7 py-3.5 font-semibold text-[var(--foreground)] transition hover:border-[#c7f36b] hover:text-[#9bc94c] dark:border-gray-700"
          >
            <Search size={18} />
            Explore Studios
          </Link>
        </div>

        <p className="mt-10 text-sm text-gray-400">
          StudioSpace — Find your perfect creative space.
        </p>
      </div>
    </main>
  );
}