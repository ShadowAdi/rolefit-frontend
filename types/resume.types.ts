export type ResumeTemplateId = "classic" | "minimalist" | "bold" | "two-column";

export interface ResumeTemplate {
  id: ResumeTemplateId | string;
  name: string;
  description: string;
}

export interface ResumeTemplatesResponse {
  templates: ResumeTemplate[];
}

export interface ResumePdfStatusResponse {
  task_id: string;
  status: string;
  result: unknown | null;
  success: boolean;
}

export interface ResumeHeader {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: string[];
}

export interface ResumeSkillGroup {
  category: string;
  items: string[];
}

export interface ResumeExperienceItem {
  role: string;
  company: string;
  location?: string;
  start?: string;
  end?: string;
  emp_type?: string;
  bullets?: string[];
}

export interface ResumeProjectItem {
  title: string;
  tech?: string;
  bullets?: string[];
  links?: string[];
}

export interface ResumePublicationItem {
  title: string;
  publisher?: string;
  year?: string;
}

export interface ResumeEducationItem {
  degree: string;
  institution: string;
  location?: string;
  year?: string;
  description?: string;
}

export interface ResumeData {
  header: ResumeHeader;
  summary?: string | null;
  skills: ResumeSkillGroup[];
  experience: ResumeExperienceItem[];
  projects: ResumeProjectItem[];
  achievements: string[];
  publications: ResumePublicationItem[];
  education: ResumeEducationItem[];
}
