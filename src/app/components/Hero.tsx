'use client';

import Link from 'next/link';
import { ArrowRight, Award, Users, Briefcase, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

const communityUrl = process.env.NEXT_PUBLIC_COMMUNITY_URL || '/contact';

export function Hero() {
  return (
    <section className="relative bg-[var(--brand-sand)] dark:bg-[#0b0f17] mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(154,210,255,0.4),_transparent_60%),radial-gradient(circle_at_80%_20%,_rgba(246,176,66,0.28),_transparent_50%)] dark:bg-[radial-gradient(circle_at_top,_rgba(35,182,168,0.3),_transparent_60%),radial-gradient(circle_at_70%_20%,_rgba(154,210,255,0.2),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,16,32,0.04),transparent,rgba(11,16,32,0.08))] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent,rgba(35,182,168,0.12))]" />
      <div className="-top-24 left-10 absolute bg-[rgba(35,182,168,0.25)] dark:bg-[rgba(35,182,168,0.28)] blur-3xl rounded-full w-44 h-44 parallax-slow" />
      <div className="top-24 right-16 absolute bg-[rgba(239,107,93,0.28)] dark:bg-[rgba(154,210,255,0.22)] blur-3xl rounded-full w-32 h-32 parallax-medium" />
      <div className="relative grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
        {/* Left Side - Content */}
        <div className="relative flex items-center px-6 py-16 lg:py-20 lg:pl-16 xl:pl-24">
          <div className="w-full max-w-xl">
            {/* Brand Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 shadow-[0_10px_30px_rgba(11,16,32,0.08)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur mb-6 px-4 py-2 border border-black/10 dark:border-white/10 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-[var(--brand-teal)]" />
              <span className="font-semibold text-[var(--brand-ink)] text-sm">Cohort Teaching Programme</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 font-display font-bold text-[var(--brand-ink)] text-5xl lg:text-6xl xl:text-7xl leading-tight"
            >
              <span className="block">Learn it.</span>
              <span className="block bg-[length:200%_200%] bg-[linear-gradient(120deg,#0b1020,#23b6a8,#f6b042)] dark:bg-[linear-gradient(120deg,#f7f2ea,#2ad7c7,#9ad2ff)] bg-clip-text text-transparent animate-[shimmer_6s_ease-in-out_infinite]">
                Build it.
              </span>
              <span className="block">Work it.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 text-slate-700 dark:text-slate-300 text-lg lg:text-xl leading-relaxed"
            >
              720degree Innovation Hub is an AI-integrated, expert-led tech academy in Abeokuta with Lagos and
              global online access. Build real products, master the business of your craft, and graduate with a
              portfolio that proves it.
            </motion.p>

            {/* Key Benefits - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-6 mb-10"
            >
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[var(--brand-amber)]" />
                <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">AI-first, real projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--brand-teal)]" />
                <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">Expert-led, community-driven</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--brand-coral)]" />
                <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">Business-ready outcomes</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex sm:flex-row flex-col gap-4 mb-12"
            >
              <Link
                href="/admissions#apply"
                className="inline-flex justify-center items-center gap-2 bg-[var(--brand-ink)] hover:bg-black dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] dark:hover:bg-[linear-gradient(135deg,#243152,#35e2cf)] shadow-[0_18px_45px_rgba(11,16,32,0.25)] dark:shadow-[0_22px_55px_rgba(35,182,168,0.35)] px-8 py-4 rounded-xl font-semibold text-white hover:scale-105 transition-all hover:-translate-y-0.5 transform"
              >
                Apply for May 2026
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#programs"
                className="inline-flex justify-center items-center gap-2 bg-white hover:bg-black/5 dark:bg-white/10 dark:hover:bg-white/20 shadow-[0_12px_30px_rgba(11,16,32,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)] px-8 py-4 border-2 border-black/10 hover:border-black/20 dark:border-white/15 dark:hover:border-white/30 rounded-xl font-semibold text-[var(--brand-ink)] dark:text-white transition-all"
              >
                Explore Programs
              </a>

              <a
                href={communityUrl}
                target={communityUrl.startsWith('http') ? '_blank' : undefined}
                rel={communityUrl.startsWith('http') ? 'noreferrer' : undefined}
                className="inline-flex justify-center items-center gap-2 bg-[var(--brand-sand)] dark:bg-white/5 dark:hover:bg-white/10 shadow-[0_14px_34px_rgba(11,16,32,0.08)] hover:shadow-[0_18px_45px_rgba(11,16,32,0.14)] px-8 py-4 border border-black/10 dark:border-white/15 rounded-xl font-semibold text-[var(--brand-ink)] dark:text-white transition-all hover:-translate-y-0.5"
              >
                Join Our Community (Free)
              </a>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-8 pt-6 border-black/10 dark:border-white/10 border-t"
            >
              <div>
                <div className="font-bold text-[var(--brand-ink)] text-3xl">3</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Schools</div>
              </div>
              <div>
                <div className="font-bold text-[var(--brand-ink)] text-3xl">6</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Courses</div>
              </div>
              <div>
                <div className="font-bold text-[var(--brand-ink)] text-3xl">6</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Months + 3 Support</div>
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
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 dark:via-black/40 to-[var(--brand-sand)]/50 dark:to-[#0b0f17]/90 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.45),transparent_55%)] dark:bg-[radial-gradient(circle_at_80%_10%,rgba(35,182,168,0.18),transparent_55%)] pointer-events-none" />

          {/* Floating Badge on Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="right-8 bottom-8 z-10 absolute bg-white/95 dark:bg-[#141b29]/90 shadow-[0_20px_60px_rgba(11,16,32,0.25)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-[var(--brand-ink)] rounded-xl w-12 h-12 font-bold text-white text-lg">
                6
              </div>
              <div>
                <div className="font-bold text-foreground">Month Programme</div>
                <div className="text-muted-foreground text-sm">+ 3 months support</div>
              </div>
            </div>
          </motion.div>

          {/* Cohort Badge on Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="top-6 right-8 z-10 absolute bg-[var(--brand-amber)] dark:bg-[rgba(243,191,98,0.95)] shadow-[0_18px_40px_rgba(246,176,66,0.35)] px-5 py-3 rounded-xl dark:text-[#1b1300]"
          >
            <div className="font-bold">Next Cohort: May 2026</div>
            <div className="font-semibold text-sm">Abeokuta + Lagos + Online</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
