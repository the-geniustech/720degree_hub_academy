"use client";

import Link from "next/link";
import { ArrowRight, Award, Users, Briefcase, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";

const communityUrl = process.env.NEXT_PUBLIC_COMMUNITY_URL || "/contact";

export function Hero() {
  return (
    <section className="relative bg-[var(--brand-ink)] mt-20 overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(240,128,16,0.18),transparent_34%),linear-gradient(120deg,rgba(0,16,32,0.94),rgba(0,32,64,0.72),rgba(0,16,32,0.96))]" />
      <div className="left-0 absolute inset-y-0 bg-[linear-gradient(90deg,rgba(0,16,32,0.92),rgba(0,16,32,0.2))] border-white/5 border-r w-1/2" />
      <div className="relative grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
        {/* Left Side - Content */}
        <div className="relative flex items-center px-6 py-16 lg:py-20 lg:pl-16 xl:pl-24">
          <div className="w-full max-w-xl">
            {/* Brand Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-flex items-center gap-2 bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur mb-6 px-4 py-2 border border-white/10 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-[var(--brand-orange)]" />
              <span className="font-semibold text-white text-sm">
                Cohort Teaching Programme
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.0,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-6 font-display font-bold text-white text-5xl lg:text-6xl xl:text-7xl leading-tight"
            >
              <span className="block">Learn it.</span>
              <span className="block bg-[length:200%_200%] bg-[linear-gradient(120deg,#ffffff,#f08010,#ffb061)] bg-clip-text text-transparent animate-[shimmer_6s_ease-in-out_infinite]">
                Build it.
              </span>
              <span className="block">Work it.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.0,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-8 text-white/78 text-lg lg:text-xl leading-relaxed"
            >
              720Degree Innovation Hub is an AI-integrated, expert-led tech
              academy in Abeokuta with Lagos and global online access. Build
              real products, master the business of your craft, and graduate
              with a portfolio that proves it.
            </motion.p>

            {/* Key Benefits - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap gap-6 mb-10"
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[var(--brand-orange)]" />
                <span className="font-medium text-white/78 text-sm">
                  AI-first, real projects
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--brand-orange)]" />
                <span className="font-medium text-white/78 text-sm">
                  Expert-led, community-driven
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--brand-orange)]" />
                <span className="font-medium text-white/78 text-sm">
                  Business-ready outcomes
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex sm:flex-row flex-col gap-4 mb-12"
            >
              <Link
                href="/admissions#apply"
                className="inline-flex justify-center items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-strong)] shadow-[0_18px_45px_rgba(240,128,16,0.28)] px-8 py-4 rounded-xl font-semibold text-white hover:scale-105 transition-all hover:-translate-y-0.5 transform"
              >
                Apply for May 2026
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#programs"
                className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.18)] px-8 py-4 border-2 border-white/15 hover:border-white/30 rounded-xl font-semibold text-white transition-all"
              >
                Explore Programs
              </a>

              <a
                href={communityUrl}
                target={communityUrl.startsWith("http") ? "_blank" : undefined}
                rel={communityUrl.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex justify-center items-center gap-2 bg-transparent hover:bg-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.14)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.2)] px-8 py-4 border border-white/15 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                Join Our Community (Free)
              </a>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap items-center gap-8 pt-6 border-white/10 border-t"
            >
              <div>
                <div className="font-bold text-white text-3xl">3</div>
                <div className="text-white/62 text-sm">Schools</div>
              </div>
              <div>
                <div className="font-bold text-white text-3xl">6</div>
                <div className="text-white/62 text-sm">Courses</div>
              </div>
              <div>
                <div className="font-bold text-white text-3xl">6</div>
                <div className="text-white/62 text-sm">Months + 3 Support</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative h-full min-h-[420px] overflow-hidden">
          <div className="absolute inset-0 parallax-slow">
            <motion.div
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.1,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full h-full"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="720Degree Innovation Hub - Tech Learning Environment"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-[color:var(--brand-ink)]/85 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(240,128,16,0.14),transparent_55%)] pointer-events-none" />

          {/* Floating Badge on Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="right-8 bottom-8 z-10 absolute bg-white/95 shadow-[0_20px_60px_rgba(0,16,32,0.28)] backdrop-blur-sm p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-[var(--brand-ink)] rounded-xl w-12 h-12 font-bold text-white text-lg">
                6
              </div>
              <div>
                <div className="font-bold text-foreground">Month Programme</div>
                <div className="text-muted-foreground text-sm">
                  + 3 months support
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cohort Badge on Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="top-6 right-8 z-10 absolute bg-[var(--brand-orange)] shadow-[0_18px_40px_rgba(240,128,16,0.35)] px-5 py-3 rounded-xl text-white"
          >
            <div className="font-bold">Next Cohort: May 2026</div>
            <div className="font-semibold text-sm">
              Abeokuta + Lagos + Online
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
