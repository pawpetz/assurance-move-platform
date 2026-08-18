import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { howItWorks } from "@/lib/site-content";

const title = "How It Works | Assurance Trucking LLC";
const description =
  "Request a quote, review pricing, schedule your date, and we handle the pickup, transport, and delivery.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HowItWorksPage,
});

const detail = [
  "Fill out the booking form with your service, pickup and drop-off details, items, and photos. It takes a few minutes and you can save your progress.",
  "We review everything you sent and send a written quote with a clear breakdown: service, labor, travel, additional items, and any deposit.",
  "Accept the quote and pay the deposit to lock in your date. You'll get a confirmation with your arrival window.",
  "On the day of service we pick up, transport, and deliver. Your booking status updates as the job moves along, and you can follow it on Track My Move.",
];

function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="From request to delivery in four steps"
        intro="No guessing, no surprise pricing. You'll know the plan and the cost before we load anything."
      />
      <section className="container-page py-16">
        <ol className="grid gap-6">
          {howItWorks.map((step, i) => (
            <li key={step.title} className="card-elevated flex flex-col gap-4 p-7 sm:flex-row sm:gap-8">
              <span className="font-display text-4xl font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
                <p className="mt-1 font-medium text-foreground/80">{step.body}</p>
                <p className="mt-3 text-sm text-muted-foreground">{detail[i]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand title="Start your booking">
        <Button asChild variant="hero" size="xl">
          <Link to="/book">Book Now</Link>
        </Button>
      </CtaBand>
    </>
  );
}