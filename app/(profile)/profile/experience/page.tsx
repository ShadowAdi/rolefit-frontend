"use client";

import ExperienceStep from "@/components/onboarding/steps/ExperienceStep";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";

const ExperiencePage = () => (
  <ProfileSectionLayout
    title="Work Experience"
    subtitle="Manage your professional background"
  >
    <ExperienceStep onNext={() => {}} />
  </ProfileSectionLayout>
);

export default ExperiencePage;
