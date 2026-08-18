import { createFileRoute, Link } from "@tanstack/react-router";
import { Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site/PageHero";

const title = "Customer Reviews | Assurance Trucking LLC";
const description = "Reviews from Assurance Trucking LLC customers. Verified feedback is published here as it is collected.";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="Customer feedback"
        intro="Only real, verified reviews are published here. This page is ready to be populated as customers submit their feedback."
      />
      <section className="container-page grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <article key={i} className="card-elevated p-6">
            <div className="flex gap-1 text-accent" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="size-4" />
              ))}
            </div>
            <Quote className="mt-4 size-5 text-muted-foreground" aria-hidden="true" />
            <p className="mt-2 text-sm text-muted-foreground">
              Review placeholder. Customer reviews will appear here once collected and approved.
            </p>
            <p className="mt-4 text-sm font-semibold">Customer name pending</p>
          </article>
        ))}
      </section>
      <CtaBand title="Recently worked with us?">
        <Button asChild variant="hero" size="xl">
          <Link to="/contact">Share Your Feedback</Link>
        </Button>
      </CtaBand>
    </>
  );
}