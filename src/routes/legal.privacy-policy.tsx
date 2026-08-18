import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/legal/privacy-policy")({
  head: () => ({
    meta: [{ title: "Privacy Policy | Assurance Trucking LLC" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy">
      <p>
        Assurance Trucking LLC collects information you provide when requesting a quote or booking a
        service, including your name, contact details, pickup and drop-off information, and any
        photos you choose to upload. This information is used to prepare quotes, schedule and
        complete your service, and communicate with you about your booking.
      </p>
      <p>
        We do not sell customer information. Uploaded photos and personal details are stored
        securely and are only accessible to Assurance Trucking LLC.
      </p>
      <p>
        This page is a placeholder. The final Privacy Policy should be reviewed and approved by the
        business owner, and may need to reflect requirements specific to your state.
      </p>
    </LegalPage>
  );
}
