import HeroSection from "@/components/global/HeroSection";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full">
      <HeroSection />

      <section
        id="features"
        className="w-full bg-gray-50 py-16 md:py-20 border-y border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-950">
              Clean output. Clear impact.
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl">
              The goal is simple: highlight the best parts of your experience
              for each role — without rewriting your entire career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-lime-100 text-lime-700 font-semibold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-950">
                Create your profile
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Add your roles, projects, and skills once. This stays as your
                master profile for future applications.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-lime-100 text-lime-700 font-semibold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-950">
                Paste the job description
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Rolefit extracts responsibilities, skills, and keywords — then
                maps them to your most relevant experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-lime-100 text-lime-700 font-semibold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-950">
                Export polished PDFs
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Download a resume + cover letter that look clean, read
                naturally, and match what the employer asked for.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="rounded-3xl border border-gray-200 bg-white p-10 md:p-14 text-center shadow-sm">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-950">
              Ready to apply with confidence?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Start with a profile, then generate role-specific documents in
              minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 text-base font-semibold text-gray-950 bg-lime-400 hover:bg-lime-300 rounded-xl shadow-sm transition-colors"
              >
                Create your profile
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 text-base font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
