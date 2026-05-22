"use client";

import ToolsStep from "@/components/onboarding/steps/ToolsStep";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";

const ToolsPage = () => (
  <ProfileSectionLayout
    title="Tools"
    subtitle="Manage the tools and technologies you know"
  >
    <ToolsStep onNext={() => {}} />
  </ProfileSectionLayout>
);

export default ToolsPage;
