import type { ReactNode } from "react";

export function Shell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Section({
  id,
  labelledBy,
  tone = "white",
  children,
  className = "",
}: {
  id: string;
  labelledBy?: string;
  tone?: "white" | "paper" | "navy";
  children: ReactNode;
  className?: string;
}) {
  const background = tone === "paper" ? "bg-paper" : tone === "navy" ? "theme-dark bg-navy" : "bg-white";

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`scroll-mt-28 lg:scroll-mt-20 ${background} ${className}`}
    >
      <Shell className="py-14 sm:py-20 lg:py-24">{children}</Shell>
    </section>
  );
}

export function SectionHeading({
  id,
  title,
  eyebrow,
  tone = "light",
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  tone?: "light" | "dark";
  children?: ReactNode;
}) {
  const titleColor = tone === "dark" ? "text-white" : "text-navy";
  const bodyColor = tone === "dark" ? "text-white/80" : "text-muted";
  const eyebrowColor = tone === "dark" ? "text-white/70" : "text-green";

  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className={`text-sm font-semibold ${eyebrowColor}`}>{eyebrow}</p> : null}
      <h2
        id={id}
        className={`font-serif text-[1.75rem] leading-tight tracking-tight text-balance sm:text-4xl ${titleColor} ${
          eyebrow ? "mt-2" : ""
        }`}
      >
        {title}
      </h2>
      {children ? (
        <div className={`mt-4 space-y-4 text-base leading-7 text-pretty sm:text-lg ${bodyColor}`}>{children}</div>
      ) : null}
    </div>
  );
}
