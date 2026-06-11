import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <span className="text-xl font-bold tracking-tight text-white">R</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">RecruitKit</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-slate-900 pb-28 pt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-400">
            Built for independent recruiters &amp; staffing agencies
          </div>
          <h1 className="mt-2 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
            The AI assistant your<br className="hidden sm:block" /> recruiting desk has been missing.
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-slate-300">
            Write job descriptions, candidate outreach, and interview questions in seconds — not
            hours. Built for recruiters who bill by the placement, not the hour.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-blue-500"
            >
              Start Free Trial
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-slate-600 px-8 py-4 text-base font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white"
            >
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="border-b border-slate-200 bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-500">
            Trusted by recruiters at independent agencies and staffing firms.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {[
              "3 tools in one",
              "< 30 seconds per output",
              "Used across 3 continents",
            ].map((stat) => (
              <span
                key={stat}
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Everything you need to fill roles faster.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              }
              title="Job Description Generator"
              description="Stop staring at a blank doc. Paste in the basics, get a polished, bias-free JD in seconds."
            />
            <FeatureCard
              icon={
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              }
              title="Candidate Outreach"
              description="LinkedIn DMs and cold emails that sound like you wrote them — because the good ones always do."
            />
            <FeatureCard
              icon={
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              }
              title="Interview Questions"
              description="Walk into every interview prepared. Generate a full question bank by role, seniority, and category."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            Dead simple. Three steps.
          </h2>
          <p className="mt-4 text-lg text-slate-500">No onboarding calls. No setup. Just open it and go.</p>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Describe the role.", body: "Tell it the job title, company, key skills — whatever you have. Even rough notes work." },
              { step: "2", title: "Pick your tool.", body: "Need a JD? An outreach message? Interview questions? Choose one and hit generate." },
              { step: "3", title: "Copy and go.", body: "Review the output, copy it, and paste it wherever you need it. Done in under 30 seconds." },
            ].map(({ step, title, body }) => (
              <div key={step} className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 bg-white">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">Simple pricing.</h2>
            <p className="mt-4 text-slate-500">One plan. Everything included.</p>
          </div>

          <div className="rounded-2xl border-2 border-blue-600 p-8 shadow-xl shadow-blue-100">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">Recruiter Pro</h3>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Most popular
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-slate-900">$79</span>
              <span className="text-lg text-slate-500">/month</span>
            </div>

            <ul className="mt-8 space-y-3">
              {[
                "Unlimited JD generation",
                "Unlimited candidate outreach",
                "Unlimited interview question banks",
                "Saves everything to your library",
                "Cancel anytime",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-700">
                  <svg className="h-5 w-5 flex-shrink-0 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/sign-up"
              className="mt-8 block w-full rounded-lg bg-blue-600 py-4 text-center text-base font-semibold text-white transition hover:bg-blue-500"
            >
              Start Free — 3 uses on us
            </Link>
            <p className="mt-3 text-center text-sm text-slate-500">No credit card required to start.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600">
              <span className="text-base font-bold text-white">R</span>
            </div>
            <span className="text-base font-bold text-white">RecruitKit</span>
          </Link>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} RecruitKit. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <Link href="/sign-in" className="transition hover:text-white">
              Sign In
            </Link>
            <Link href="/sign-up" className="transition hover:text-white">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-8 shadow-sm transition hover:shadow-md hover:border-blue-200">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-3 leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}
