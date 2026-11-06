import Link from "next/link";
import { LucideIcon, FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  buttonText?: string;
  buttonLink?: string;
}

export default function EmptyState({
  title = "Nothing Here Yet",
  description = "There is no data to display right now.",
  icon: Icon = FolderOpen,
  buttonText,
  buttonLink,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center px-6 py-12 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#c7f36b]/15">
        <Icon size={38} strokeWidth={1.5} className="text-[#9bc94c]" />
      </div>

      {/* Text */}
      <h2 className="mb-3 text-2xl font-bold text-[var(--foreground)]">
        {title}
      </h2>

      <p className="mb-7 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
        {description}
      </p>

      {/* Optional Button */}
      {buttonText && buttonLink && (
        <Link
          href={buttonLink}
          className="rounded-full bg-[#c7f36b] px-7 py-3 font-semibold text-black transition hover:bg-[#b5e45a]"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}