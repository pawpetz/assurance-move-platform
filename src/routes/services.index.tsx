import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { services } from "@/lib/site-content";

const title = "Moving, Trucking & Delivery Services | Assurance Trucking LLC";
const description =
  "Residential and commercial moving, local and long-distance moves, freight, furniture delivery, junk removal, and storage.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything we move, haul, and deliver"
        intro="Choose the service that fits your job. Not sure which one? Send a request and we'll help you sort it out."
      />
      <section className="container-page grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article key={s.slug} className="card-elevated flex flex-col p-6 hover:shadow-[var(--shadow-lift)]">
            <ServiceIcon name={s.icon} />
            <h2 className="mt-4 text-lg font-semibold">{s.name}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.short}</p>
            <Link
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Learn more <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </section>
      <CtaBand>
        <Button asChild variant="hero" size="xl">
          <Link to="/book">Request a Quote</Link>
        </Button>
      </CtaBand>
    </>
  );
}