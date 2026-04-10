"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Briefcase,
} from "lucide-react";
import {
  calculateAmountDue,
  formatNaira,
  getBaseTuition,
  type ProgramDetail,
} from "../lib/programs";
import { EnrollmentModal } from "../components/EnrollmentModal";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Reveal } from "../components/Reveal";
import { useProgrammesData } from "../components/ProgrammesProvider";

interface ProgramDetailPageProps {
  program: ProgramDetail;
}

export function ProgramDetailPage({ program }: ProgramDetailPageProps) {
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const { data } = useProgrammesData();
  const locations = data.locations;

  if (!program) {
    return (
      <div className="pt-24 pb-20 text-center">
        <h1 className="mb-4 font-bold text-[var(--brand-ink)] text-3xl">
          Program not found
        </h1>
        <Link
          href="/programs"
          className="text-slate-600 dark:text-slate-300 underline"
        >
          View all programs
        </Link>
      </div>
    );
  }

  const baseOnsite = getBaseTuition(program, "abeokuta", locations);
  const baseOnline = getBaseTuition(program, "online", locations);
  const deposit = calculateAmountDue(baseOnsite, "deposit");
  const full = calculateAmountDue(baseOnsite, "full");

  return (
    <div className="bg-[var(--brand-sand)] dark:bg-[#0b0f17] pt-20">
      {/* Hero Section */}
      <section className="relative flex items-center bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0b0f17,#121826)] py-16 min-h-[calc(100vh-5rem)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(154,210,255,0.45),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(35,182,168,0.3),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-35" />
        <div className="absolute inset-0 opacity-20 texture-noise mix-blend-multiply" />
        <div className="-top-24 right-10 absolute bg-[rgba(35,182,168,0.25)] dark:bg-[rgba(35,182,168,0.3)] blur-3xl rounded-full w-56 h-56 parallax-slow" />
        <div className="bottom-10 left-8 absolute bg-[rgba(246,176,66,0.22)] dark:bg-[rgba(154,210,255,0.22)] blur-3xl rounded-full w-40 h-40 parallax-medium" />

        <div className="z-10 relative mx-auto px-6 max-w-7xl">
          <Reveal delay={0} className="inline-flex mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-black dark:hover:text-white dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </Reveal>

          <div className="items-center gap-12 grid md:grid-cols-2">
            <div>
              <Reveal
                delay={80}
                className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 mb-4 px-4 py-2 border border-black/10 dark:border-white/10 rounded-full font-medium text-slate-700 dark:text-slate-200 text-sm"
              >
                <Sparkles className="w-4 h-4 text-[var(--brand-teal)]" />
                {program.school} School | 6-month programme
              </Reveal>
              <Reveal delay={140}>
                <h1 className="mb-6 font-display font-bold text-[var(--brand-ink)] text-5xl">
                  {program.title}
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mb-6 text-slate-700 dark:text-slate-300 text-xl">
                  {program.summary}
                </p>
              </Reveal>
              <Reveal delay={260}>
                <p className="mb-8 text-slate-600 dark:text-slate-300 text-base">
                  {program.overview}
                </p>
              </Reveal>

              <div className="gap-6 grid grid-cols-2 mb-8">
                <Reveal
                  delay={300}
                  className="flex items-center gap-3 bg-white/90 dark:bg-white/10 shadow-[0_18px_40px_rgba(11,16,32,0.12)] hover:shadow-[0_26px_55px_rgba(11,16,32,0.18)] dark:hover:shadow-[0_28px_60px_rgba(35,182,168,0.25)] dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] backdrop-blur-sm p-4 border border-black/10 dark:border-white/10 rounded-lg transform-gpu transition hover:-translate-y-1"
                >
                  <Clock className="w-6 h-6 text-[var(--brand-ink)]" />
                  <div>
                    <div className="font-semibold text-[var(--brand-ink)]">
                      Duration
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      6 months + 3 months support
                    </div>
                  </div>
                </Reveal>
                <Reveal
                  delay={360}
                  className="flex items-center gap-3 bg-white/90 dark:bg-white/10 shadow-[0_18px_40px_rgba(11,16,32,0.12)] hover:shadow-[0_26px_55px_rgba(11,16,32,0.18)] dark:hover:shadow-[0_28px_60px_rgba(35,182,168,0.25)] dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] backdrop-blur-sm p-4 border border-black/10 dark:border-white/10 rounded-lg transform-gpu transition hover:-translate-y-1"
                >
                  <Calendar className="w-6 h-6 text-[var(--brand-ink)]" />
                  <div>
                    <div className="font-semibold text-[var(--brand-ink)]">
                      Schedule
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      Mon - Wed, 10am - 2pm
                    </div>
                  </div>
                </Reveal>
                <Reveal
                  delay={420}
                  className="flex items-center gap-3 bg-white/90 dark:bg-white/10 shadow-[0_18px_40px_rgba(11,16,32,0.12)] hover:shadow-[0_26px_55px_rgba(11,16,32,0.18)] dark:hover:shadow-[0_28px_60px_rgba(35,182,168,0.25)] dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] backdrop-blur-sm p-4 border border-black/10 dark:border-white/10 rounded-lg transform-gpu transition hover:-translate-y-1"
                >
                  <MapPin className="w-6 h-6 text-[var(--brand-ink)]" />
                  <div>
                    <div className="font-semibold text-[var(--brand-ink)]">
                      Locations
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      Abeokuta | Lagos | Online
                    </div>
                  </div>
                </Reveal>
                <Reveal
                  delay={480}
                  className="flex items-center gap-3 bg-white/90 dark:bg-white/10 shadow-[0_18px_40px_rgba(11,16,32,0.12)] hover:shadow-[0_26px_55px_rgba(11,16,32,0.18)] dark:hover:shadow-[0_28px_60px_rgba(35,182,168,0.25)] dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] backdrop-blur-sm p-4 border border-black/10 dark:border-white/10 rounded-lg transform-gpu transition hover:-translate-y-1"
                >
                  <Briefcase className="w-6 h-6 text-[var(--brand-ink)]" />
                  <div>
                    <div className="font-semibold text-[var(--brand-ink)]">
                      Tuition
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      {formatNaira(baseOnsite)} onsite |{" "}
                      {formatNaira(baseOnline)} online
                    </div>
                  </div>
                </Reveal>
              </div>

              <div className="flex sm:flex-row flex-col gap-4">
                <Reveal delay={520}>
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="bg-[var(--brand-ink)] hover:bg-black dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] dark:hover:bg-[linear-gradient(135deg,#243152,#35e2cf)] shadow-[0_18px_50px_rgba(11,16,32,0.28)] dark:shadow-[0_22px_60px_rgba(35,182,168,0.35)] px-8 py-4 rounded-lg font-semibold text-white transition-all"
                  >
                    Apply to this Track
                  </button>
                </Reveal>
                <Reveal delay={580}>
                  <Link
                    href="/tuition"
                    className="bg-white hover:bg-black/5 dark:bg-white/10 dark:hover:bg-white/20 shadow-[0_12px_30px_rgba(11,16,32,0.12)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.4)] px-8 py-4 border border-black/10 dark:border-white/10 rounded-lg font-semibold text-[var(--brand-ink)] dark:text-white transition-all"
                  >
                    View Tuition
                  </Link>
                </Reveal>
              </div>

              <Reveal
                delay={640}
                className="mt-6 text-slate-600 dark:text-slate-400 text-sm"
              >
                Pay {formatNaira(deposit)} now (75%) or {formatNaira(full)}{" "}
                upfront (5% discount).
              </Reveal>
            </div>

            <Reveal delay={180} className="group relative">
              <div className="absolute -inset-6 bg-[radial-gradient(circle_at_top,_rgba(35,182,168,0.35),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(35,182,168,0.45),_transparent_65%)] opacity-70 blur-2xl rounded-[32px]" />
              <div className="parallax-slow">
                <ImageWithFallback
                  src={program.heroImage}
                  alt={program.title}
                  className="relative shadow-[0_35px_90px_rgba(11,16,32,0.28)] dark:shadow-[0_35px_90px_rgba(0,0,0,0.55)] border border-white/60 dark:border-white/10 rounded-3xl transform-gpu group-hover:scale-[1.02] transition duration-500 group-hover:[transform:perspective(900px)_rotateY(-2deg)_rotateX(1deg)]"
                />
              </div>
              <div className="hidden -right-6 -bottom-8 absolute md:flex items-center gap-2 bg-white/80 dark:bg-white/10 shadow-[0_16px_40px_rgba(11,16,32,0.15)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur px-4 py-2 border border-black/10 dark:border-white/10 rounded-full text-slate-700 dark:text-slate-200 text-sm">
                Cohort-ready portfolio
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Programme Format */}
      <section className="relative bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] py-20 overflow-hidden">
        <div className="-top-12 right-12 absolute bg-[rgba(154,210,255,0.25)] dark:bg-[rgba(35,182,168,0.22)] blur-3xl rounded-full w-32 h-32 parallax-fast" />
        <div className="absolute inset-0 opacity-20 texture-dots" />
        <div className="z-10 relative gap-10 grid md:grid-cols-2 mx-auto px-6 max-w-7xl">
          <Reveal
            delay={0}
            className="bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.85)] shadow-[0_20px_45px_rgba(11,16,32,0.12)] hover:shadow-[0_30px_70px_rgba(11,16,32,0.18)] dark:hover:shadow-[0_32px_70px_rgba(35,182,168,0.25)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] p-8 border border-black/10 dark:border-white/10 rounded-2xl transform-gpu transition hover:-translate-y-1"
          >
            <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-3xl">
              Programme Format
            </h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li>Live classes Monday to Wednesday, 10:00am to 2:00pm WAT.</li>
              <li>
                Assignments and project work Thursday to Sunday with TA support.
              </li>
              <li>Monthly expert sessions with real product reviews.</li>
              <li>Cross-school team project in Months 4 and 5.</li>
            </ul>
          </Reveal>
          <Reveal
            delay={160}
            className="bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.85)] shadow-[0_20px_45px_rgba(11,16,32,0.12)] hover:shadow-[0_30px_70px_rgba(11,16,32,0.18)] dark:hover:shadow-[0_32px_70px_rgba(35,182,168,0.25)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] p-8 border border-black/10 dark:border-white/10 rounded-2xl transform-gpu transition hover:-translate-y-1"
          >
            <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-3xl">
              Learning Outcomes
            </h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              {program.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3">
                  <span className="bg-[var(--brand-teal)] mt-2 rounded-full w-2 h-2" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Highlights */}
      <section className="relative bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] py-20 overflow-hidden">
        <div className="-bottom-12 left-8 absolute bg-[rgba(246,176,66,0.2)] dark:bg-[rgba(154,210,255,0.2)] blur-3xl rounded-full w-36 h-36 parallax-medium" />
        <div className="absolute inset-0 texture-grid opacity-20" />
        <div className="z-10 relative mx-auto px-6 max-w-7xl">
          <Reveal delay={0}>
            <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-4xl text-center">
              Programme Highlights
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mb-12 text-slate-600 dark:text-slate-300 text-xl text-center">
              A high-intensity curriculum backed by expert sessions and business
              modules.
            </p>
          </Reveal>

          <div className="gap-6 grid md:grid-cols-3">
            {program.highlights.map((outcome, index) => (
              <Reveal
                key={index}
                delay={index * 120}
                className="bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.85)] shadow-[0_18px_40px_rgba(11,16,32,0.12)] hover:shadow-[0_28px_60px_rgba(11,16,32,0.2)] dark:hover:shadow-[0_30px_65px_rgba(35,182,168,0.25)] dark:shadow-[0_22px_55px_rgba(0,0,0,0.45)] p-6 border border-black/10 dark:border-white/10 rounded-xl transform-gpu transition hover:-translate-y-1"
              >
                <p className="text-slate-700 dark:text-slate-300 text-lg">
                  {outcome}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Projects */}
      <section className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0f1522,#131b2b)] py-20 overflow-hidden">
        <div className="-top-20 right-8 absolute bg-[rgba(35,182,168,0.2)] dark:bg-[rgba(35,182,168,0.25)] blur-3xl rounded-full w-48 h-48 parallax-slow" />
        <div className="absolute inset-0 opacity-20 texture-dots" />
        <div className="z-10 relative mx-auto px-6 max-w-7xl">
          <Reveal delay={0}>
            <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-4xl text-center">
              Project Portfolio
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mb-12 text-slate-600 dark:text-slate-300 text-xl text-center">
              Real-world projects that prove your skills to employers and
              clients.
            </p>
          </Reveal>
          <div className="gap-6 grid md:grid-cols-3">
            {program.projects.map((project, index) => (
              <Reveal
                key={project.title}
                delay={index * 120}
                className="bg-white dark:bg-[#141b29] shadow-[0_20px_50px_rgba(11,16,32,0.12)] hover:shadow-[0_30px_70px_rgba(11,16,32,0.2)] dark:hover:shadow-[0_32px_70px_rgba(35,182,168,0.25)] dark:shadow-[0_26px_60px_rgba(0,0,0,0.45)] p-6 border border-black/10 dark:border-white/10 rounded-xl transform-gpu transition hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(1deg)_rotateY(-1deg)]"
              >
                <h3 className="mb-2 font-bold text-[var(--brand-ink)] text-xl">
                  {project.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {project.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0f1522,#131b2b)] py-20 overflow-hidden">
        <div className="bottom-10 left-12 absolute bg-[rgba(154,210,255,0.22)] dark:bg-[rgba(35,182,168,0.22)] blur-3xl rounded-full w-40 h-40 parallax-medium" />
        <div className="absolute inset-0 texture-grid opacity-20" />
        <div className="z-10 relative mx-auto px-6 max-w-7xl">
          <Reveal delay={0}>
            <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-4xl text-center">
              Curriculum Highlights
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mb-12 text-slate-600 dark:text-slate-300 text-xl text-center">
              Structured progression from fundamentals to graduation delivery.
            </p>
          </Reveal>

          <div className="space-y-6">
            {program.curriculum.map((module, index) => (
              <Reveal
                key={index}
                delay={index * 120}
                className="bg-white dark:bg-[#141b29] shadow-[0_18px_40px_rgba(11,16,32,0.12)] hover:shadow-[0_28px_60px_rgba(11,16,32,0.2)] dark:hover:shadow-[0_30px_65px_rgba(35,182,168,0.25)] dark:shadow-[0_24px_55px_rgba(0,0,0,0.45)] p-6 border border-black/10 dark:border-white/10 rounded-xl transform-gpu transition hover:-translate-y-1"
              >
                <h3 className="mb-4 font-bold text-[var(--brand-ink)] text-xl">
                  {module.label}
                </h3>
                <div className="gap-4 grid md:grid-cols-2 text-slate-700 dark:text-slate-300">
                  {module.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-start gap-3">
                      <span className="bg-[var(--brand-teal)] mt-1 rounded-full w-2 h-2" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Technologies */}
      <section className="relative bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] py-20 overflow-hidden">
        <div className="-top-16 right-8 absolute bg-[rgba(239,107,93,0.2)] dark:bg-[rgba(154,210,255,0.2)] blur-3xl rounded-full w-36 h-36 parallax-fast" />
        <div className="absolute inset-0 opacity-25 texture-dots" />
        <div className="z-10 relative mx-auto px-6 max-w-7xl">
          <Reveal delay={0}>
            <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-4xl text-center">
              Tools & Technologies
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mb-12 text-slate-600 dark:text-slate-300 text-xl text-center">
              Modern tools used by teams building real products.
            </p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-3">
            {program.tools.map((tool, index) => (
              <Reveal
                key={tool}
                delay={index * 80}
                className="bg-[var(--brand-sand)] dark:bg-white/10 shadow-[0_12px_30px_rgba(11,16,32,0.1)] hover:shadow-[0_20px_45px_rgba(11,16,32,0.18)] dark:hover:shadow-[0_22px_45px_rgba(35,182,168,0.25)] dark:shadow-[0_16px_35px_rgba(0,0,0,0.4)] px-5 py-2 border border-black/10 dark:border-white/10 rounded-full text-slate-700 dark:text-slate-200 transform-gpu transition hover:-translate-y-1"
              >
                {tool}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0f1522,#131b2b)] py-20 overflow-hidden">
        <div className="-top-12 left-8 absolute bg-[rgba(35,182,168,0.2)] dark:bg-[rgba(35,182,168,0.25)] blur-3xl rounded-full w-36 h-36 parallax-slow" />
        <div className="absolute inset-0 texture-grid opacity-20" />
        <div className="z-10 relative mx-auto px-6 max-w-6xl">
          <Reveal delay={0}>
            <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-4xl text-center">
              Assessment & Reviews
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mb-12 text-slate-600 dark:text-slate-300 text-xl text-center">
              Continuous feedback, expert reviews, and portfolio audits keep
              standards high.
            </p>
          </Reveal>
          <div className="gap-6 grid md:grid-cols-3">
            {program.assessment.map((item, index) => (
              <Reveal
                key={item}
                delay={index * 120}
                className="bg-white dark:bg-[#141b29] shadow-[0_18px_40px_rgba(11,16,32,0.12)] hover:shadow-[0_28px_60px_rgba(11,16,32,0.2)] dark:hover:shadow-[0_30px_65px_rgba(35,182,168,0.25)] dark:shadow-[0_24px_55px_rgba(0,0,0,0.45)] p-6 border border-black/10 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 transform-gpu transition hover:-translate-y-1"
              >
                {item}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="relative bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] py-20 overflow-hidden">
        <div className="right-12 bottom-10 absolute bg-[rgba(154,210,255,0.2)] dark:bg-[rgba(35,182,168,0.22)] blur-3xl rounded-full w-36 h-36 parallax-medium" />
        <div className="absolute inset-0 opacity-25 texture-dots" />
        <div className="z-10 relative mx-auto px-6 max-w-7xl">
          <Reveal delay={0}>
            <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-4xl text-center">
              Career Opportunities
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mb-12 text-slate-600 dark:text-slate-300 text-xl text-center">
              Roles you can pursue after graduation and post-grad support.
            </p>
          </Reveal>

          <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
            {program.roles.map((career, index) => (
              <Reveal
                key={career}
                delay={index * 100}
                className="bg-[var(--brand-sand)] dark:bg-[rgba(20,27,41,0.85)] shadow-[0_18px_40px_rgba(11,16,32,0.12)] hover:shadow-[0_28px_60px_rgba(11,16,32,0.2)] dark:hover:shadow-[0_30px_65px_rgba(35,182,168,0.25)] dark:shadow-[0_24px_55px_rgba(0,0,0,0.45)] p-6 border border-black/10 dark:border-white/10 rounded-xl font-semibold text-[var(--brand-ink)] dark:text-slate-100 transform-gpu transition hover:-translate-y-1"
              >
                {career}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Post-Grad Support */}
      <section className="relative bg-white dark:bg-[linear-gradient(160deg,#0f1522,#141b29)] py-20 overflow-hidden">
        <div className="-top-12 left-6 absolute bg-[rgba(246,176,66,0.2)] dark:bg-[rgba(154,210,255,0.2)] blur-3xl rounded-full w-36 h-36 parallax-fast" />
        <div className="z-10 relative mx-auto px-6 max-w-6xl">
          <Reveal
            delay={0}
            className="bg-[var(--brand-ink)] dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] shadow-[0_28px_70px_rgba(11,16,32,0.35)] dark:shadow-[0_32px_70px_rgba(35,182,168,0.35)] p-10 border border-white/10 rounded-2xl text-white"
          >
            <h3 className="mb-4 font-display font-bold text-2xl">
              Post-Grad Support (Months 7-9)
            </h3>
            <div className="gap-6 grid md:grid-cols-2 text-white/80 text-sm">
              <div>
                Free workspace access in Abeokuta and Lagos hubs (weekday open
                to close).
              </div>
              <div>
                Bi-weekly career mentorship covering CVs, interviews, and salary
                negotiation.
              </div>
              <div>
                1:1 mentorship session with an industry expert tailored to your
                goals.
              </div>
              <div>
                Hiring introductions and freelance referrals with no revenue
                cut.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Graduation Standard */}
      <section className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0f1522,#131b2b)] py-20 overflow-hidden">
        <div className="bottom-10 left-8 absolute bg-[rgba(35,182,168,0.2)] dark:bg-[rgba(35,182,168,0.25)] blur-3xl rounded-full w-36 h-36 parallax-medium" />
        <div className="absolute inset-0 opacity-20 texture-noise" />
        <div className="z-10 relative mx-auto px-6 max-w-5xl">
          <Reveal
            delay={0}
            className="bg-[var(--brand-ink)] dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] shadow-[0_28px_70px_rgba(11,16,32,0.35)] dark:shadow-[0_32px_70px_rgba(35,182,168,0.35)] p-10 border border-white/10 rounded-2xl text-white"
          >
            <h3 className="mb-4 font-display font-bold text-2xl">
              Graduation Standard
            </h3>
            <p className="text-white/80">{program.graduationStandard}</p>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-[var(--brand-ink)] dark:bg-[linear-gradient(160deg,#0b0f17,#121826)] py-20 overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(154,210,255,0.35),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(35,182,168,0.35),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-25" />
        <div className="right-10 -bottom-20 absolute bg-[rgba(246,176,66,0.25)] dark:bg-[rgba(154,210,255,0.25)] blur-3xl rounded-full w-44 h-44 parallax-slow" />
        <div className="z-10 relative mx-auto px-6 max-w-4xl text-center">
          <Reveal delay={0}>
            <h2 className="mb-6 font-display font-bold text-4xl">
              Ready to Apply?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mb-8 text-white/80 text-xl">
              Cohorts start January, May, and September. Online students get 15%
              tuition reduction.
            </p>
          </Reveal>
          <div className="flex sm:flex-row flex-col justify-center gap-4">
            <Reveal delay={200}>
              <button
                onClick={() => setShowEnrollModal(true)}
                className="bg-white hover:bg-black/5 dark:bg-white/10 dark:hover:bg-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] dark:shadow-[0_24px_55px_rgba(0,0,0,0.45)] px-8 py-4 dark:border dark:border-white/20 rounded-lg font-semibold text-[var(--brand-ink)] dark:text-white transition-all"
              >
                Apply Now
              </button>
            </Reveal>
            <Reveal delay={260}>
              <Link
                href="/admissions"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 border border-white/20 rounded-lg font-semibold text-white transition-all"
              >
                Admissions Guide
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <EnrollmentModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        programSlug={program.slug}
      />
    </div>
  );
}
