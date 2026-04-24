import { Sparkles, Wrench, Briefcase, Users, Rocket } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    icon: Sparkles,
    title: "AI-first, Not AI-afraid",
    description:
      "AI tools are taught from Day 1 as core professional instruments for prompting, verification, and workflow acceleration.",
  },
  {
    icon: Wrench,
    title: "Build Real Things",
    description:
      "Students ship real products from Month 2. Code goes live, designs get tested, data answers real business questions.",
  },
  {
    icon: Briefcase,
    title: "Understand the Business",
    description:
      "Every track includes business modules covering pricing, client management, equity, and how products make money.",
  },
  {
    icon: Rocket,
    title: "Learn from Practitioners",
    description:
      "Monthly industry experts bring real problems, real decisions, and professional standards into the classroom.",
  },
  {
    icon: Users,
    title: "Community Over Competition",
    description:
      "Cross-school teams in Months 4 and 5 mirror real product companies and build a collaboration-first culture.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0f1522,#131b2b)] py-20 overflow-hidden"
    >
      <div className="-top-24 right-0 absolute bg-[rgba(154,210,255,0.35)] dark:bg-[rgba(35,182,168,0.22)] blur-3xl rounded-full w-40 h-40 parallax-fast" />
      <div className="bottom-0 left-10 absolute bg-[rgba(239,107,93,0.2)] dark:bg-[rgba(154,210,255,0.18)] blur-3xl rounded-full w-32 h-32 parallax-slow" />
      <div className="absolute inset-0 texture-grid opacity-20" />
      <div className="z-10 relative mx-auto px-6 max-w-7xl">
        <div className="mb-16 text-center">
          <Reveal delay={0} speed="slow">
            <h2 className="mb-4 font-display font-bold text-[var(--brand-ink)] text-3xl md:text-4xl lg:text-5xl">
              The 720Degree Learning Principles
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto max-w-2xl text-slate-700 dark:text-slate-300 text-lg">
              The programme is built on five principles that turn beginners into
              business-ready builders.
            </p>
          </Reveal>
        </div>

        <div className="gap-8 grid md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal
                key={index}
                delay={index * 110}
                speed="fast"
                className="bg-white dark:bg-[#141b29] shadow-[0_18px_45px_rgba(11,16,32,0.08)] hover:shadow-[0_30px_60px_rgba(11,16,32,0.16)] dark:hover:shadow-[0_30px_70px_rgba(35,182,168,0.25)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.4)] p-8 border border-black/10 dark:border-white/10 rounded-2xl transform-gpu transition hover:-translate-y-1 hover:[transform:perspective(800px)_rotateX(1deg)_rotateY(1deg)]"
              >
                <div className="flex justify-center items-center bg-[var(--brand-ink)] dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] shadow-[0_12px_30px_rgba(11,16,32,0.25)] dark:shadow-[0_18px_40px_rgba(35,182,168,0.35)] mb-6 rounded-xl w-14 h-14">
                  <Icon className="text-white" size={26} />
                </div>
                <h3 className="mb-3 font-bold text-[var(--brand-ink)] text-xl">
                  {feature.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {feature.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
