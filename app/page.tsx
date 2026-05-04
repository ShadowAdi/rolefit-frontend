
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Tailor your resume to <span className="text-emerald-700">any job description</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          Upload your base profile and paste a job description. We generate a perfectly aligned resume and cover letter designed to get past ATS and grab the recruiter's attention.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="px-8 py-4 text-base font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
          >
            Get Started for Free
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 text-base font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to stand out</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stop sending the exact same resume to every employer. Rolefit automatically highlights your most relevant experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Add your comprehensive work history, education, and skills just once. We use this as your master database.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Paste JD</h3>
              <p className="text-gray-600 leading-relaxed">
                Found a job you like? Paste the job description. Our AI analyzes the core requirements and keywords.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Custom PDFs</h3>
              <p className="text-gray-600 leading-relaxed">
                Download a custom-tailored resume and cover letter that perfectly match what the employer is looking for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Ready to land more interviews?
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Join professionals using Rolefit to optimize their applications and stand out from the crowd.
        </p>
        <Link
          href="/register"
          className="px-8 py-4 text-base font-semibold text-white bg-gray-900 hover:bg-black rounded-lg shadow-sm transition-colors"
        >
          Create Your Profile
        </Link>
      </section>
    </main>
  );
}
