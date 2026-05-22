import { getProfile } from "@/action/profile/profile.action";
import { GetUserSkillsAction } from "@/action/skills/skill.action";
import { GetAllExperiencesAction } from "@/action/experience/experience.action";

export const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

export const isOnboardingCompleted = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";
};

export const markOnboardingCompleted = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
};

export const clearOnboardingCompleted = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
};

const hasAnyOnboardingData = async (token: string): Promise<boolean> => {
  const [skills, exp] = await Promise.all([
    GetUserSkillsAction(token),
    GetAllExperiencesAction(token, { limit: 1 }),
  ]);
  if (skills.success && (skills.data?.length ?? 0) > 0) return true;
  if (exp.success && (exp.data?.length ?? 0) > 0) return true;
  return false;
};

export const resolvePostLoginRedirect = async (
  token: string,
): Promise<string> => {
  try {
    const result = await getProfile(token);
    const hasProfile = result.success && !!result.data?.data;

    if (!hasProfile) return "/profile";
    if (isOnboardingCompleted()) return "/profile";

    // Different device / cleared storage — check backend for existing onboarding data
    if (await hasAnyOnboardingData(token)) {
      markOnboardingCompleted();
      return "/profile";
    }

    return "/onboarding";
  } catch {
    return "/profile";
  }
};
