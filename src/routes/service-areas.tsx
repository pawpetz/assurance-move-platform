import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { serviceAreas } from "@/lib/site-content";

const title = "Service Areas | Assurance Trucking LLC";
const description =
  "Areas served by Assurance Trucking LLC, including Maryland, Washington DC, and Virginia. Long-distance jobs quoted on request.";

export const Route = createFileRoute("/service-areas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ServiceAreasPage,
});

function ServiceAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Areas"
        title="Where we operate"
        intro="Service areas are kept current by the owner. If your route isn't listed, send a request and we'll confirm whether we can cover it."
      />
      <section className="container-page grid gap-5 py-16 sm:grid-cols-2">
        {serviceAreas.map((a) => (
          <article key={a.region} className="card-elevated p-7">
            <MapPin className="size-5 text-accent" aria-hidden="true" />
            <h2 className="mt-3 text-xl font-semibold">{a.region}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{a.note}</p>
          </article>
        ))}
      </section>
      <CtaBand title="Not sure if we cover your route?">
        <Button asChild variant="hero" size="xl">
          <Link to="/contact">Contact Us</Link>
        </Button>
      </CtaBand>
    </>
  );
}