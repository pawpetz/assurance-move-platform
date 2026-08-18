import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/PageHero";
import { business } from "@/lib/site-content";

const title = "Contact Us | Assurance Trucking LLC";
const description =
  "Get in touch with Assurance Trucking LLC by phone, email, or the contact form below.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: once notifications are wired up, this should call a server
    // function that emails/texts the owner and stores the message.
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    setSent(true);
    toast.success("Message sent. We'll get back to you soon.");
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        intro="Questions about a service, a quote, or an existing booking? Reach out below."
      />
      <section className="container-page grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold">Contact information</h2>
          <ul className="mt-5 grid gap-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              {business.phone ? (
                <a
                  href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:underline"
                >
                  {business.phone}
                </a>
              ) : (
                <span className="text-muted-foreground">
                  Phone number to be added by the owner.
                </span>
              )}
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              {business.email ? (
                <a href={`mailto:${business.email}`} className="hover:underline">
                  {business.email}
                </a>
              ) : (
                <span className="text-muted-foreground">Email to be added by the owner.</span>
              )}
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className={business.address ? undefined : "text-muted-foreground"}>
                {business.address || "Business address to be added by the owner."}
              </span>
            </li>
          </ul>

          <h2 className="mt-8 text-lg font-semibold">Business hours</h2>
          <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
            {business.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span>{h.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          {sent ? (
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">Thanks — message sent.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll get back to you as soon as we can. If your question is about scheduling a
                move, you can also submit a full request from Book Now.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="justify-self-start"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
