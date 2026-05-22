"use client";

import EducationStep from "@/components/onboarding/steps/EducationStep";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";

const EducationPage = () => (
  <ProfileSectionLayout
    title="Education"
    subtitle="Manage your academic qualifications"
  >
    <EducationStep onNext={() => {}} />
  </ProfileSectionLayout>
);

export default EducationPage;
