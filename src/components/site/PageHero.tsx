import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="container-page py-14 md:py-20">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold text-foreground md:text-5xl">{title}</h1>
        {intro ? <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{intro}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function CtaBand({
  title = "Ready to plan your move?",
  body = "Send us the details and we'll follow up with a written quote and available dates.",
  children,
}: {
  title?: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <section className="container-page my-20">
      <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground md:px-14 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
            <p className="mt-3 text-primary-foreground/80">{body}</p>
          </div>
          <div className="flex flex-wrap gap-3">{children}</div>
        </div>
      </div>
    </section>
  );
}