import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site/PageHero";
import { valueProps } from "@/lib/site-content";

const title = "About Assurance Trucking LLC | Personal Service, Professional Results";
const description =
  "Assurance Trucking LLC is an owner-operated moving and trucking business focused on dependable service and clear communication.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Personal Service. Professional Results."
        intro="Assurance Trucking LLC is committed to providing dependable moving, trucking, delivery, and logistics services while keeping communication clear and customers informed throughout the process."
      />

      <section className="container-page grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <div className="card-elevated p-7">
            <h2 className="text-2xl font-semibold">Meet the Owner</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              This section is a placeholder. The owner's biography, background, and photo will be added
              here once provided — it is fully editable and nothing has been invented on his behalf.
            </p>
          </div>
          <div className="card-elevated p-7">
            <h2 className="text-2xl font-semibold">Our approach</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Every job is quoted in writing after we review your details and photos. You'll know the
              scope, the cost, and the schedule before we begin, and you'll hear from us as the job
              progresses.
            </p>
          </div>
          <div className="card-elevated p-7">
            <h2 className="text-2xl font-semibold">Licensing &amp; insurance</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Editable placeholder. Licensing, DOT, and insurance details will be published here only
              after they are confirmed by the owner.
            </p>
          </div>
        </div>
        <aside className="card-elevated h-fit p-7">
          <h2 className="text-lg font-semibold">What guides the work</h2>
          <ul className="mt-5 space-y-4">
            {valueProps.map((v) => (
              <li key={v.title}>
                <p className="text-sm font-semibold">{v.title}</p>
                <p className="text-sm text-muted-foreground">{v.body}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <CtaBand title="Have a job in mind?">
        <Button asChild variant="hero" size="xl">
          <Link to="/book">Request a Quote</Link>
        </Button>
      </CtaBand>
    </>
  );
}