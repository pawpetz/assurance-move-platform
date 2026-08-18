import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  booking: z.string().optional(),
});

export const Route = createFileRoute("/book/confirmation")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Request Received | Assurance Trucking LLC" }],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { booking } = Route.useSearch();

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent">
        <CheckCircle2 className="size-9" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold md:text-4xl">Request Received</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Thank you for choosing Assurance Trucking LLC. We've received your service request and will
        review the information provided. We'll contact you with your quote and availability.
      </p>
      {booking ? (
        <p className="mt-6 rounded-lg border border-border bg-surface px-6 py-3 font-display text-lg font-semibold">
          Booking Request #: {booking}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {booking ? (
          <Button asChild variant="hero" size="lg">
            <Link to="/track" search={{ booking }}>
              View Request
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="outline" size="lg">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </section>
  );
}
