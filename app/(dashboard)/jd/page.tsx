"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GetJDsAction } from "@/action/job-description/jd.action";
import { JobDescriptionResponse } from "@/types/jobDescription.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Briefcase, MapPin, DollarSign, Trash2 } from "lucide-react";
import { toast } from "sonner";

const JDPage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [jds, setJds] = useState<JobDescriptionResponse[]>([]);
  const [filteredJds, setFilteredJds] = useState<JobDescriptionResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJDs = async () => {
      if (!token || authLoading) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await GetJDsAction(token);

        if (result.success && result.data) {
          setJds(result.data);
          setFilteredJds(result.data);
        } else {
          setError(result.message || "Failed to fetch job descriptions");
        }
      } catch (err) {
        console.error("Error fetching JDs:", err);
        setError("Failed to load job descriptions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJDs();
  }, [token, authLoading]);

  useEffect(() => {
    const filtered = jds.filter((jd) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (jd.role_name?.toLowerCase().includes(searchLower) ?? false) ||
        (jd.company?.toLowerCase().includes(searchLower) ?? false) ||
        (jd.location_city?.toLowerCase().includes(searchLower) ?? false) ||
        (jd.location?.toLowerCase().includes(searchLower) ?? false) ||
        (jd.tech_stack?.some((tech) =>
          tech.toLowerCase().includes(searchLower)
        ) ?? false)
      );
    });

    setFilteredJds(filtered);
  }, [searchQuery, jds]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view job descriptions</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-950 mb-2">Job Descriptions</h1>
              <p className="text-gray-600">
                Manage and organize job descriptions for AI content generation
              </p>
            </div>
            <Button
              onClick={() => router.push("/jd/create")}
              className="bg-lime-500 hover:bg-lime-600 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Job Description
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by role, company, location, or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-gray-300"
            />
          </div>

          {!isLoading && (
            <p className="text-sm text-gray-600 mt-3">
              {filteredJds.length} job description{filteredJds.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500 mx-auto"></div>
              <p className="text-gray-600">Loading job descriptions...</p>
            </div>
          </div>
        ) : filteredJds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {jds.length === 0 ? "No Job Descriptions Yet" : "No Results Found"}
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              {jds.length === 0
                ? "Start by creating your first job description to use for AI content generation"
                : "Try adjusting your search terms"}
            </p>
            {jds.length === 0 && (
              <Button
                onClick={() => router.push("/jd/create")}
                className="bg-lime-500 hover:bg-lime-600 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Create First JD
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJds.map((jd) => (
              <div
                key={jd.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer flex flex-col h-full"
                onClick={() => router.push(`/jd/${jd.id}`)}
              >
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-lime-50 to-transparent">
                  <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
                    {jd.role_name || "Untitled Role"}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    {jd.company || "Company not specified"}
                  </p>
                </div>

                <div className="p-5 space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {jd.role_type && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {jd.role_type}
                      </span>
                    )}
                    {jd.location && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                        <MapPin className="w-3 h-3" />
                        {jd.location}
                      </span>
                    )}
                  </div>

                  {jd.location_city && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="truncate">{jd.location_city}</span>
                    </div>
                  )}

                  {(jd.salary_min || jd.salary_max) && (
                    <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span>
                        {jd.salary_min && `${jd.salary_min}`}
                        {jd.salary_min && jd.salary_max && " - "}
                        {jd.salary_max && `${jd.salary_max}`}
                        {jd.salary_currency && ` ${jd.salary_currency}`}
                      </span>
                    </div>
                  )}

                  {jd.tech_stack && jd.tech_stack.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Stack</p>
                      <div className="flex flex-wrap gap-1">
                        {jd.tech_stack.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-lime-100 text-lime-700"
                          >
                            {tech}
                          </span>
                        ))}
                        {jd.tech_stack.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{jd.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {jd.summary && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {jd.summary}
                    </p>
                  )}
                </div>

                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/jd/${jd.id}`);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Delete feature coming soon");
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JDPage;
