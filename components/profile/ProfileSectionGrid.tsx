"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Wrench,
  FolderGit2,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GetAllExperiencesAction } from "@/action/experience/experience.action";
import { GetAllAcademicAction } from "@/action/academic/academic.action";
import { GetUserSkillsAction } from "@/action/skills/skill.action";
import { GetUserToolsAction } from "@/action/tools/tool.action";
import { GetAllProjectsAction } from "@/action/project/project.action";
import { GetAllPublications } from "@/action/publication/publication.action";

interface SectionPreviewItem {
  primary: string;
  secondary?: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  count: number | null;
  preview: SectionPreviewItem[];
}

const truncate = (s: string | null | undefined, n = 40) => {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n)}…` : s;
};

export const ProfileSectionGrid: React.FC = () => {
  const { token } = useAuth();
  const [sections, setSections] = useState<Section[]>([
    {
      id: "experience",
      title: "Experience",
      description: "Professional work history",
      icon: Briefcase,
      href: "/profile/experience",
      count: null,
      preview: [],
    },
    {
      id: "education",
      title: "Education",
      description: "Academic qualifications",
      icon: GraduationCap,
      href: "/profile/education",
      count: null,
      preview: [],
    },
    {
      id: "skills",
      title: "Skills",
      description: "Professional skills",
      icon: Sparkles,
      href: "/profile/skills",
      count: null,
      preview: [],
    },
    {
      id: "tools",
      title: "Tools",
      description: "Tools and technologies",
      icon: Wrench,
      href: "/profile/tools",
      count: null,
      preview: [],
    },
    {
      id: "projects",
      title: "Projects",
      description: "Portfolio projects",
      icon: FolderGit2,
      href: "/profile/projects",
      count: null,
      preview: [],
    },
    {
      id: "publications",
      title: "Publications",
      description: "Publications & papers",
      icon: BookOpen,
      href: "/profile/publications",
      count: null,
      preview: [],
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const [exp, edu, skills, tools, projects, pubs] = await Promise.all([
        GetAllExperiencesAction(token, { sortOrder: "desc" }),
        GetAllAcademicAction(token),
        GetUserSkillsAction(token),
        GetUserToolsAction(token),
        GetAllProjectsAction(token),
        GetAllPublications(token),
      ]);
      if (cancelled) return;

      const expData = exp.success ? exp.data ?? [] : [];
      const eduData = edu.success ? edu.data ?? [] : [];
      const skillsData = skills.success ? skills.data ?? [] : [];
      const toolsData = tools.success ? tools.data ?? [] : [];
      const projectsData = projects.success ? projects.data ?? [] : [];
      const pubsData = pubs.success ? pubs.data ?? [] : [];

      setSections((prev) =>
        prev.map((s) => {
          switch (s.id) {
            case "experience":
              return {
                ...s,
                count: expData.length,
                preview: expData.slice(0, 2).map((it) => ({
                  primary: it.role,
                  secondary: it.company_name,
                })),
              };
            case "education":
              return {
                ...s,
                count: eduData.length,
                preview: eduData.slice(0, 2).map((it) => ({
                  primary: it.degree_name,
                  secondary: it.college_name,
                })),
              };
            case "skills":
              return {
                ...s,
                count: skillsData.length,
                preview: skillsData
                  .slice(0, 4)
                  .map((it) => ({ primary: it.name })),
              };
            case "tools":
              return {
                ...s,
                count: toolsData.length,
                preview: toolsData
                  .slice(0, 4)
                  .map((it) => ({ primary: it.name })),
              };
            case "projects":
              return {
                ...s,
                count: projectsData.length,
                preview: projectsData.slice(0, 2).map((it) => ({
                  primary: it.title,
                  secondary: truncate(it.description, 50),
                })),
              };
            case "publications":
              return {
                ...s,
                count: pubsData.length,
                preview: pubsData.slice(0, 2).map((it) => ({
                  primary: it.title,
                  secondary: it.publisher,
                })),
              };
            default:
              return s;
          }
        }),
      );
      setIsLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-950">Your Background</h2>
        {isLoading && (
          <Loader2 className="size-4 animate-spin text-gray-400" />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          const isChips = s.id === "skills" || s.id === "tools";
          return (
            <Link
              key={s.id}
              href={s.href}
              className="group bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg p-5 hover:bg-white/60 hover:border-lime-200 transition-all flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-lime-100 flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-lime-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-950 leading-tight">
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-500">{s.description}</p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-gray-400 group-hover:text-lime-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              <div className="mt-auto pt-3 border-t border-white/60">
                {s.count === null ? (
                  <p className="text-xs text-gray-400">Loading…</p>
                ) : s.count === 0 ? (
                  <p className="text-xs text-gray-500 italic">
                    None added yet — click to add
                  </p>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-lime-700 mb-2">
                      {s.count} {s.count === 1 ? "item" : "items"}
                    </p>
                    {isChips ? (
                      <div className="flex flex-wrap gap-1">
                        {s.preview.map((p) => (
                          <span
                            key={p.primary}
                            className="text-xs bg-lime-50 text-lime-700 border border-lime-200 px-2 py-0.5 rounded-full"
                          >
                            {p.primary}
                          </span>
                        ))}
                        {s.count > s.preview.length && (
                          <span className="text-xs text-gray-500">
                            +{s.count - s.preview.length} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <ul className="space-y-1.5">
                        {s.preview.map((p) => (
                          <li key={p.primary} className="text-xs">
                            <p className="font-medium text-gray-800 truncate">
                              {p.primary}
                            </p>
                            {p.secondary && (
                              <p className="text-gray-500 truncate">
                                {p.secondary}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
