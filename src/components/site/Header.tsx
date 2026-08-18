import { Link } from "@tanstack/react-router";
import { Menu, Phone, Truck, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { business } from "@/lib/site-content";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About Us" },
  { to: "/service-areas", label: "Service Areas" },
  { to: "/reviews", label: "Reviews" },
  { to: "/faq", label: "FAQ" },
  { to: "/track", label: "Track My Move" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="flex items-center gap-2.5" aria-label={`${business.name} home`}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Truck className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-semibold sm:text-base">Assurance Trucking</span>
            <span className="block text-[11px] tracking-wide text-muted-foreground">LLC</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {nav.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {business.phone ? (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}>
                <Phone className="size-4" aria-hidden="true" />
                {business.phone}
              </a>
            </Button>
          ) : null}
          <Button asChild size="sm" variant="accent" className="hidden sm:inline-flex">
            <Link to="/book">Book Now</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background xl:hidden">
          <nav aria-label="Mobile" className="container-page grid gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                activeProps={{ className: "bg-secondary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="accent" size="lg" className="mt-2">
              <Link to="/book" onClick={() => setOpen(false)}>
                Book Now
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}