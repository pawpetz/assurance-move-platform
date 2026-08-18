import type { ReactNode } from "react";
import { PageHero } from "@/components/site/PageHero";

export function LegalPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <section className="container-page py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 rounded-lg border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
            Placeholder content. This page must be reviewed and replaced with policy language
            approved by the owner before publishing.
          </div>
          <div className="grid gap-5 text-sm leading-relaxed text-muted-foreground">{children}</div>
        </div>
      </section>
    </>
  );
}
