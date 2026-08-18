import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MapPin, Quote, Star } from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/hero-moving.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { CtaBand } from "@/components/site/PageHero";
import { business, howItWorks, serviceAreas, services, valueProps } from "@/lib/site-content";

const title = "Assurance Trucking LLC | Moving, Trucking & Delivery";
const description =
  "Owner-operated moving, trucking, delivery, and junk removal. Request a quote online, upload photos, and track your job from pickup to delivery.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function QuickStart() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ service: services[0]!.slug, pickupZip: "", dropoffZip: "", date: "" });

  return (
    <form
      className="w-full max-w-md rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/book", search: { ...form } });
      }}
    >
      <h2 className="font-display text-lg font-semibold">What do you need?</h2>
      <div className="mt-4 grid gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="qs-service">Service</Label>
          <select
            id="qs-service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value as typeof form.service })}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="qs-pickup">Pickup ZIP</Label>
            <Input
              id="qs-pickup"
              inputMode="numeric"
              maxLength={10}
              placeholder="20745"
              className="h-11"
              value={form.pickupZip}
              onChange={(e) => setForm({ ...form, pickupZip: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="qs-dropoff">Drop-off ZIP</Label>
            <Input
              id="qs-dropoff"
              inputMode="numeric"
              maxLength={10}
              placeholder="22030"
              className="h-11"
              value={form.dropoffZip}
              onChange={(e) => setForm({ ...form, dropoffZip: e.target.value })}
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="qs-date">Preferred date</Label>
          <Input
            id="qs-date"
            type="date"
            className="h-11"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <Button type="submit" variant="hero" size="xl" className="mt-1 w-full">
          Start Booking
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          No payment required to request a quote.
        </p>
      </div>
    </form>
  );
}

function Index() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Movers loading wrapped furniture into an Assurance Trucking box truck outside a home"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="container-page grid items-center gap-10 py-16 md:py-28 lg:grid-cols-2">
          <div className="text-primary-foreground">
            <p className="eyebrow">Owner-operated · {serviceAreas[0]?.region} · DC · VA</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] md:text-6xl">
              Moving Made Simple. Delivered With Confidence.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-primary-foreground/85">
              Reliable moving, trucking, delivery, and logistics services designed around your needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/book">Book Your Service</Link>
              </Button>
              <Button asChild variant="onDark" size="xl">
                <Link to="/book">Get a Quote</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
              {["Written quotes", "Photo-based estimates", "Status updates"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:justify-self-end">
            <QuickStart />
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow">Why Choose Assurance Trucking?</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold md:text-4xl">
          A professional crew, personal attention, and no surprises.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((v) => (
            <div key={v.title} className="card-elevated p-6 hover:shadow-[var(--shadow-lift)]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <CheckCircle2 className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Services</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">What we move</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/services">View all services</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article key={s.slug} className="card-elevated flex flex-col p-6 hover:shadow-[var(--shadow-lift)]">
                <ServiceIcon name={s.icon} />
                <h3 className="mt-4 text-lg font-semibold">{s.name}</h3>
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
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow">How It Works</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Four simple steps</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-4">
          {howItWorks.map((step, i) => (
            <li key={step.title} className="card-elevated p-6">
              <span className="font-display text-3xl font-bold text-accent">{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button asChild variant="accent" size="lg">
            <Link to="/book">Start Your Booking</Link>
          </Button>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">What customers say</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Customer reviews will appear here once they are collected and approved by the owner.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="card-elevated p-6">
                  <div className="flex gap-1 text-accent" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="size-4" />
                    ))}
                  </div>
                  <Quote className="mt-4 size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Review placeholder — real customer feedback will be published here.
                  </p>
                  <p className="mt-4 text-sm font-semibold">Customer name pending</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold">Service areas</h3>
            <ul className="mt-4 space-y-3">
              {serviceAreas.map((a) => (
                <li key={a.region} className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold">{a.region}</span>
                    <span className="block text-sm text-muted-foreground">{a.note}</span>
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-lg font-semibold">Get in touch</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {business.phone || "Phone number to be added in Settings."}
            </p>
            <p className="text-sm text-muted-foreground">
              {business.email || "Email address to be added in Settings."}
            </p>
            <Button asChild className="mt-5 w-full" size="lg">
              <Link to="/contact">Contact Assurance Trucking</Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaBand>
        <Button asChild variant="hero" size="xl">
          <Link to="/book">Book Now</Link>
        </Button>
        <Button asChild variant="onDark" size="xl">
          <Link to="/track">Track My Move</Link>
        </Button>
      </CtaBand>
    </>
  );
}
