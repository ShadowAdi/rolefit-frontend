
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full">
      <section className="w-full">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-30 h-72 w-72 rounded-full bg-lime-200/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-35 h-80 w-80 rounded-full bg-gray-200/70 blur-3xl" />

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm">
              <span className="inline-flex h-2 w-2 rounded-full bg-lime-500" />
              ATS-friendly resumes + cover letters
            </div>

            <h1 className="mt-8 text-5xl md:text-6xl font-semibold tracking-tight text-gray-950">
              Tailor your resume to
              <span className="block text-gray-950">
                every <span className="text-lime-600">job description</span>
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              Paste a JD, pick what you want to emphasize, and export clean PDFs.
              Rolefit matches keywords without turning your resume into fluff.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="px-8 py-4 text-base font-semibold text-gray-950 bg-lime-400 hover:bg-lime-300 rounded-xl shadow-sm transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 text-base font-semibold text-gray-900 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
              >
                See how it works
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-600">
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
                One profile, many applications
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
                Keyword alignment with context
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
                Export-ready PDFs
              </div>
            </div>
          </div>
        </div>
      </section>

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
              The goal is simple: highlight the best parts of your experience for
              each role — without rewriting your entire career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-lime-100 text-lime-700 font-semibold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-950">Create your profile</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Add your roles, projects, and skills once. This stays as your
                master profile for future applications.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-lime-100 text-lime-700 font-semibold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-950">Paste the job description</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Rolefit extracts responsibilities, skills, and keywords — then
                maps them to your most relevant experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-lime-100 text-lime-700 font-semibold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-950">Export polished PDFs</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Download a resume + cover letter that look clean, read naturally,
                and match what the employer asked for.
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
