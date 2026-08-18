import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { howItWorks, serviceBySlug } from "@/lib/site-content";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = serviceBySlug(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service not found" }, { name: "robots", content: "noindex" }] };
    }
    const t = `${loaderData.service.name} | Assurance Trucking LLC`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.service.short },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.service.short },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  errorComponent: ServiceNotFound,
  component: ServiceDetail,
});

function ServiceNotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-semibold">Service not found</h1>
      <p className="mt-2 text-muted-foreground">That service page doesn't exist.</p>
      <Button asChild className="mt-6">
        <Link to="/services">View all services</Link>
      </Button>
    </div>
  );
}

function ServiceDetail() {
  const { service } = Route.useLoaderData();

  return (
    <>
      <PageHero eyebrow="Service" title={service.name} intro={service.overview}>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="accent" size="lg">
            <Link to="/book">Request a Quote</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">Ask a Question</Link>
          </Button>
        </div>
      </PageHero>

      <section className="container-page grid gap-10 py-16 lg:grid-cols-2">
        <div className="card-elevated p-7">
          <ServiceIcon name={service.icon} />
          <h2 className="mt-4 text-2xl font-semibold">What's included</h2>
          <ul className="mt-5 space-y-3">
            {service.includes.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-elevated p-7">
          <h2 className="text-2xl font-semibold">What to expect</h2>
          <ul className="mt-5 space-y-3">
            {service.expect.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Scope is confirmed in writing before any work begins.
          </p>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="text-2xl font-semibold md:text-3xl">Booking process</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-4">
            {howItWorks.map((step, i) => (
              <li key={step.title} className="card-elevated p-6">
                <span className="font-display text-3xl font-bold text-accent">{i + 1}</span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {service.faqs.length ? (
        <section className="container-page py-16">
          <h2 className="text-2xl font-semibold md:text-3xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-6 max-w-3xl">
            {service.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ) : null}

      <CtaBand title="Ready to plan your move?">
        <Button asChild variant="hero" size="xl">
          <Link to="/book">Request a Quote</Link>
        </Button>
      </CtaBand>
    </>
  );
}