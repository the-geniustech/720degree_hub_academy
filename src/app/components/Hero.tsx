"use client";

import Link from "next/link";
import { ArrowRight, Award, Users, Briefcase, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

const communityUrl = process.env.NEXT_PUBLIC_COMMUNITY_URL || "/contact";

export function Hero() {
  return (
    <section className="relative mt-20 overflow-hidden bg-[var(--brand-ink)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(240,128,16,0.18),transparent_34%),linear-gradient(120deg,rgba(0,16,32,1),rgba(0,32,64,0.92))]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(0,16,32,0),rgba(0,16,32,0.75))]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl min-w-0 items-center gap-10 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-14">
        <div className="min-w-0 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-[var(--brand-orange)]" />
            <span className="text-sm font-semibold text-white">
              AI-integrated cohort academy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.0,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-5 max-w-full font-display text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-6xl"
          >
            Learn Tech Skills
            <span className="block bg-[linear-gradient(120deg,#ffffff,#f08010,#ffb061)] bg-[length:200%_200%] bg-clip-text text-transparent animate-[shimmer_6s_ease-in-out_infinite]">
              That Actually Work
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.0,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-7 max-w-full text-lg leading-relaxed text-white/80 lg:max-w-xl lg:text-xl"
          >
            Join a focused tech academy where learners collaborate on real
            products, master AI-powered workflows, and graduate with a portfolio
            that can stand in front of clients, employers, and founders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-8 flex max-w-full flex-wrap gap-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur">
              <Award className="h-4 w-4 text-[var(--brand-orange)]" />
              AI-first real projects
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur">
              <Users className="h-4 w-4 text-[var(--brand-orange)]" />
              Expert-led community
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur">
              <Briefcase className="h-4 w-4 text-[var(--brand-orange)]" />
              Business-ready outcomes
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-7 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/admissions#apply"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-orange)] px-8 py-4 font-semibold text-white shadow-[0_18px_45px_rgba(240,128,16,0.32)] transition-all hover:-translate-y-0.5 hover:scale-105 hover:bg-[var(--brand-orange-strong)] sm:w-auto"
            >
              Apply for May 2026
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#programs"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/15 bg-white/10 px-8 py-4 font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:border-white/30 hover:bg-white/20 sm:w-auto"
            >
              Explore Programs
            </a>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.58,
              ease: [0.22, 1, 0.36, 1],
            }}
            href={communityUrl}
            target={communityUrl.startsWith("http") ? "_blank" : undefined}
            rel={communityUrl.startsWith("http") ? "noreferrer" : undefined}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/76 transition hover:text-white"
          >
            Join Our Community (Free)
            <ArrowRight className="h-4 w-4" />
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.68,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 grid w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur sm:grid-cols-3"
          >
            <div className="px-5 py-4">
              <div className="text-3xl font-bold text-white">3</div>
              <div className="text-sm text-white/65">Schools</div>
            </div>
            <div className="border-t border-white/10 px-5 py-4 sm:border-l sm:border-t-0">
              <div className="text-3xl font-bold text-white">6</div>
              <div className="text-sm text-white/65">Courses</div>
            </div>
            <div className="border-t border-white/10 px-5 py-4 sm:border-l sm:border-t-0">
              <div className="text-3xl font-bold text-white">6+3</div>
              <div className="text-sm text-white/65">Months support</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 28, scale: 0.985 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[340px] min-w-0 lg:min-h-[560px]"
        >
          <div className="absolute -left-5 -top-5 hidden h-20 w-20 border-l-2 border-t-2 border-[var(--brand-orange)] lg:block" />
          <div className="absolute -bottom-5 -right-5 hidden h-20 w-20 border-b-2 border-r-2 border-[var(--brand-orange)] lg:block" />

          <div className="relative h-[390px] overflow-hidden rounded-2xl border border-white/12 bg-white/5 shadow-[0_35px_90px_rgba(0,0,0,0.38)] lg:h-[560px]">
            <ImageWithFallback
              src="/images/hero-african-laptop-learners.jpg"
              alt="African learners smiling and collaborating around a laptop"
              loading="eager"
              className="h-full w-full object-cover object-[54%_center]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_68%,rgba(0,16,32,0.42))]" />
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 rounded-2xl border border-white/12 bg-[color:var(--brand-ink)]/78 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur sm:left-auto sm:right-5 sm:w-72">
            <div className="inline-flex w-fit rounded-full bg-[var(--brand-orange)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Next Cohort
            </div>
            <div>
              <div className="text-xl font-bold text-white">May 2026</div>
              <div className="text-sm font-semibold text-white/70">
                Abeokuta | Lagos | Online
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
