import { Link } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { business, serviceAreas, services } from "@/lib/site-content";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
              <Truck className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display font-semibold">Assurance Trucking LLC</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/75">{business.tagline}</p>
        </div>

        <nav aria-label="Services" className="text-sm">
          <h2 className="font-display text-sm font-semibold">Services</h2>
          <ul className="mt-4 space-y-2 text-primary-foreground/75">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-primary-foreground">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="text-sm">
          <h2 className="font-display text-sm font-semibold">Company</h2>
          <ul className="mt-4 space-y-2 text-primary-foreground/75">
            <li>
              <Link to="/about" className="hover:text-primary-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-primary-foreground">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-primary-foreground">
                Track My Move
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/legal/privacy-policy" className="hover:text-primary-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/legal/terms" className="hover:text-primary-foreground">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="font-display text-sm font-semibold">Service Areas</h2>
          <ul className="mt-4 space-y-2 text-primary-foreground/75">
            {serviceAreas.map((a) => (
              <li key={a.region}>{a.region}</li>
            ))}
          </ul>
          <h2 className="mt-6 font-display text-sm font-semibold">Contact</h2>
          <ul className="mt-3 space-y-2 text-primary-foreground/75">
            <li>{business.phone || "Phone: to be added in Settings"}</li>
            <li>{business.email || "Email: to be added in Settings"}</li>
            <li>{business.address || "Address: to be added in Settings"}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-primary-foreground/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Assurance Trucking LLC. All rights reserved.
          </p>
          <p>Moving, trucking, delivery and logistics services.</p>
        </div>
      </div>
    </footer>
  );
}