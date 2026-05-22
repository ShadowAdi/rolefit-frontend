"use client";

import PublicationsStep from "@/components/onboarding/steps/PublicationsStep";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";

const PublicationsPage = () => (
  <ProfileSectionLayout
    title="Publications"
    subtitle="Manage your publications and papers"
  >
    <PublicationsStep onNext={() => {}} />
  </ProfileSectionLayout>
);

export default PublicationsPage;
