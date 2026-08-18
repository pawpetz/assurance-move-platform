import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [{ title: "Terms & Conditions | Assurance Trucking LLC" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms & Conditions">
      <p>
        Submitting a booking request through this website is a request for a quote, not a confirmed
        booking. A job is only confirmed once a written quote has been accepted and any required
        deposit has been received.
      </p>
      <p>
        Pricing, deposits, cancellation terms, and payment policies will be confirmed on your
        written quote. This page is a placeholder pending final terms approved by the business
        owner.
      </p>
    </LegalPage>
  );
}
