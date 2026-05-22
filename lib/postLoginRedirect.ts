import { getProfile } from "@/action/profile/profile.action";

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

export const resolvePostLoginRedirect = async (
  token: string,
): Promise<string> => {
  try {
    const result = await getProfile(token);
    const profile = result.success ? result.data?.data : null;

    if (!profile) {
      clearOnboardingCompleted();
      return "/profile";
    }

    if (profile.isOnboarded) {
      markOnboardingCompleted();
      return "/profile";
    }

    clearOnboardingCompleted();
    return "/onboarding";
  } catch {
    return "/profile";
  }
};
