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

    // No profile exists → go to onboarding to choose method
    if (!profile) {
      clearOnboardingCompleted();
      return "/onboarding";
    }

    // Profile exists and onboarding is complete → go to profile
    if (profile.isOnboarded) {
      markOnboardingCompleted();
      return "/profile";
    }

    // Profile exists but onboarding not complete → go to onboarding steps
    clearOnboardingCompleted();
    return "/onboarding";
  } catch {
    // Default to onboarding for new users
    return "/onboarding";
  }
};
