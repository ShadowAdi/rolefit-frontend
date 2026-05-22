"use client";

import ProjectsStep from "@/components/onboarding/steps/ProjectsStep";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";

const ProjectsPage = () => (
  <ProfileSectionLayout
    title="Projects"
    subtitle="Manage your portfolio projects"
  >
    <ProjectsStep onNext={() => {}} />
  </ProfileSectionLayout>
);

export default ProjectsPage;
