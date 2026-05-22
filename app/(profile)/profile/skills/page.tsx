"use client";

import SkillsStep from "@/components/onboarding/steps/SkillsStep";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";

const SkillsPage = () => (
  <ProfileSectionLayout title="Skills" subtitle="Manage your professional skills">
    <SkillsStep onNext={() => {}} />
  </ProfileSectionLayout>
);

export default SkillsPage;
