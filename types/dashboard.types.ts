export interface DashboardStats {
  totalJobDescriptions: number;
  totalDocuments: number;
  totalResumes: number;
  totalCoverLetters: number;
  completedDocuments: number;
  pendingDocuments: number;
  failedDocuments: number;
}

export interface DashboardProfileSummary {
  fullName: string | null;
  headline: string | null;
  isOnboarded: boolean;
  totalProjects: number;
  totalExperiences: number;
  totalSkills: number;
  totalTools: number;
  totalPublications: number;
  totalAcademics: number;
}

export interface DashboardRecentJob {
  id: string;
  roleName: string | null;
  company: string | null;
  roleType: string | null;
  location: string | null;
  createdAt: string | null;
}

export interface DashboardRecentDocument {
  id: string;
  type: string;
  status: string;
  createdAt: string | null;
}

export interface DashboardResponse {
  stats: DashboardStats;
  profile: DashboardProfileSummary;
  recentJobs: DashboardRecentJob[];
  recentDocuments: DashboardRecentDocument[];
}
