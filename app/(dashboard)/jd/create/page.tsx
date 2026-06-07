"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Wand2, FileText } from "lucide-react";

const CreateJDPage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

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
          <p className="text-gray-600 mb-4">Please log in to create job descriptions</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-950 mb-3">
            Create Job Description
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to create your job description
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <div
            className="group cursor-pointer"
            onClick={() => router.push("/jd/create/generate")}
          >
            <div className="h-full p-8 bg-white rounded-xl border-2 border-gray-200 hover:border-lime-500 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-full bg-lime-100 group-hover:bg-lime-200 transition-colors">
                  <Wand2 className="w-8 h-8 text-lime-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Generate from Text
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Paste a job description and let AI automatically extract and structure
                  all the important details like role, tech stack, and requirements.
                </p>

                <ul className="text-sm text-gray-600 space-y-2 mb-8 text-left w-full">
                  <li className="flex items-start gap-2">
                    <span className="text-lime-600 font-bold mt-0.5">✓</span>
                    <span>Paste raw job description text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lime-600 font-bold mt-0.5">✓</span>
                    <span>AI extracts key information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lime-600 font-bold mt-0.5">✓</span>
                    <span>Quick and easy setup</span>
                  </li>
                </ul>

                <Button className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold">
                  Generate JD
                </Button>
              </div>
            </div>
          </div>

          <div
            className="group cursor-pointer"
            onClick={() => router.push("/jd/create/manual")}
          >
            <div className="h-full p-8 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Fill Manually
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Carefully fill in each field with specific details about the job
                  opening. Perfect for structured data entry.
                </p>

                <ul className="text-sm text-gray-600 space-y-2 mb-8 text-left w-full">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                    <span>Full control over each field</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                    <span>Ensure data accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">✓</span>
                    <span>Detailed form guidance</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold"
                >
                  Fill Manually
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/jd")}
            className="text-gray-600"
          >
            Back to Job Descriptions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateJDPage;
