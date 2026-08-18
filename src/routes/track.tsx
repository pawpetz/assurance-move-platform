import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/site/PageHero";
import { bookingStatusOrder, getBookingByNumber, type StoredBooking } from "@/lib/bookings-store";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  booking: z.string().optional(),
});

export const Route = createFileRoute("/track")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Track My Move | Assurance Trucking LLC" },
      {
        name: "description",
        content:
          "Enter your booking number to check the status of your Assurance Trucking service.",
      },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { booking: bookingFromUrl } = Route.useSearch();
  const [value, setValue] = useState(bookingFromUrl ?? "");
  const [result, setResult] = useState<StoredBooking | null | undefined>(undefined);

  function runLookup(number: string) {
    if (!number.trim()) {
      setResult(undefined);
      return;
    }
    setResult(getBookingByNumber(number) ?? null);
  }

  useEffect(() => {
    if (bookingFromUrl) runLookup(bookingFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Track My Move"
        title="Track your move"
        intro="Enter your booking number to see the current status of your job."
      />
      <section className="container-page py-14">
        <div className="mx-auto max-w-xl">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              runLookup(value);
            }}
          >
            <Input
              placeholder="e.g. AT-10482"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Booking number"
            />
            <Button type="submit" variant="hero">
              Track
            </Button>
          </form>

          <div className="mt-10">
            {result === undefined ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
                <PackageSearch className="size-8" />
                <p className="text-sm">Enter your booking number above to see your status.</p>
              </div>
            ) : result === null ? (
              <div className="rounded-lg border border-border bg-surface p-6 text-center">
                <p className="font-medium">We couldn't find that booking number.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Double-check the number from your confirmation, or{" "}
                  <Link to="/contact" className="underline">
                    contact us
                  </Link>{" "}
                  for help.
                </p>
              </div>
            ) : (
              <StatusTimeline booking={result} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function StatusTimeline({ booking }: { booking: StoredBooking }) {
  const currentIndex = bookingStatusOrder.indexOf(booking.status);
  const isCancelled = booking.status === "Cancelled";

  return (
    <div className="rounded-xl border border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Booking #{booking.bookingNumber}</p>
          <p className="text-lg font-semibold">{isCancelled ? "Cancelled" : booking.status}</p>
        </div>
      </div>

      {!isCancelled ? (
        <ol className="mt-6 grid gap-3">
          {bookingStatusOrder.map((status, i) => {
            const reached = i <= currentIndex;
            return (
              <li key={status} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs",
                    reached
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {reached ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    reached ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {status}
                </span>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          This booking was cancelled. Contact us if you'd like to reschedule.
        </p>
      )}
    </div>
  );
}
