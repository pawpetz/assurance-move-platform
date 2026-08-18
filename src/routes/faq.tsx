import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { faqItems } from "@/lib/site-content";

const title = "Frequently Asked Questions | Assurance Trucking LLC";
const description =
  "Answers about quotes, deposits, scheduling, photo uploads, tracking, storage, and what we can transport.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered"
        intro="If you don't see your question here, contact us and we'll get you an answer."
      />
      <section className="container-page py-16">
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {faqItems.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <CtaBand title="Still have a question?">
        <Button asChild variant="hero" size="xl">
          <Link to="/contact">Contact Us</Link>
        </Button>
      </CtaBand>
    </>
  );
}