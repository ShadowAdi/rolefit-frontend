'use client';

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-lime-600">Rolefit</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to help job seekers present their best selves to employers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2024, Rolefit emerged from a simple observation: job seekers spend 
              too much time tailoring resumes and not enough time preparing for interviews. 
              We built Rolefit to automate the tedious parts of job applications while 
              keeping your authentic voice front and center.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To empower every job seeker with tools that highlight their unique strengths 
              and match them with opportunities where they'll thrive. We believe technology 
              should remove barriers, not create them.
            </p>
          </div>
        </div>

        <div className="bg-lime-500 rounded-2xl shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your job search?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of job seekers who've improved their application success rate
          </p>
          <Link 
            href="/register" 
            className="inline-block px-8 py-3 bg-white text-lime-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </main>
  );
}