"use client";

import { trackInitiateCheckout } from "@/lib/tracking";

export function CheckoutButton({
  href,
  label,
  fullWidth = false,
  compact = false,
}: {
  href: string | null;
  label: string;
  fullWidth?: boolean;
  compact?: boolean;
}) {
  const className = [
    "inline-flex max-w-full items-center justify-center rounded-full bg-green text-center font-semibold leading-tight text-white hover:bg-green-hover",
    compact ? "min-h-10 px-4 py-2 text-sm" : "min-h-12 px-5 py-3 text-base",
    fullWidth ? "w-full" : "",
  ].join(" ");

  if (!href) {
    return (
      <button type="button" className={className}>
        {label}
      </button>
    );
  }

  return (
    <a href={href} className={className} onClick={() => trackInitiateCheckout()}>
      {label}
    </a>
  );
}
