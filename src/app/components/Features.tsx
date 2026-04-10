import { Sparkles, Wrench, Briefcase, Users, Rocket } from 'lucide-react';
import { Reveal } from './Reveal';

const features = [
  {
    icon: Sparkles,
    title: 'AI-first, Not AI-afraid',
    description:
      'AI tools are taught from Day 1 as core professional instruments for prompting, verification, and workflow acceleration.',
  },
  {
    icon: Wrench,
    title: 'Build Real Things',
    description:
      'Students ship real products from Month 2. Code goes live, designs get tested, data answers real business questions.',
  },
  {
    icon: Briefcase,
    title: 'Understand the Business',
    description:
      'Every track includes business modules covering pricing, client management, equity, and how products make money.',
  },
  {
    icon: Rocket,
    title: 'Learn from Practitioners',
    description:
      'Monthly industry experts bring real problems, real decisions, and professional standards into the classroom.',
  },
  {
    icon: Users,
    title: 'Community Over Competition',
    description:
      'Cross-school teams in Months 4 and 5 mirror real product companies and build a collaboration-first culture.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-[var(--brand-sand)] dark:bg-[linear-gradient(160deg,#0f1522,#131b2b)] relative overflow-hidden">
      <div className="absolute -top-24 right-0 h-40 w-40 rounded-full bg-[rgba(154,210,255,0.35)] blur-3xl parallax-fast dark:bg-[rgba(35,182,168,0.22)]" />
      <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-[rgba(239,107,93,0.2)] blur-3xl parallax-slow dark:bg-[rgba(154,210,255,0.18)]" />
      <div className="absolute inset-0 texture-grid opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Reveal delay={0} speed="slow">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--brand-ink)] mb-4 font-display">
              The 720degree Learning Principles
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              The programme is built on five principles that turn beginners into business-ready builders.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal
                key={index}
                delay={index * 110}
                speed="fast"
                className="bg-white p-8 rounded-2xl border border-black/10 shadow-[0_18px_45px_rgba(11,16,32,0.08)] hover:shadow-[0_30px_60px_rgba(11,16,32,0.16)] transition transform-gpu hover:-translate-y-1 hover:[transform:perspective(800px)_rotateX(1deg)_rotateY(1deg)] dark:bg-[#141b29] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_30px_70px_rgba(35,182,168,0.25)]"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--brand-ink)] flex items-center justify-center mb-6 shadow-[0_12px_30px_rgba(11,16,32,0.25)] dark:bg-[linear-gradient(135deg,#1f2a44,#2ad7c7)] dark:shadow-[0_18px_40px_rgba(35,182,168,0.35)]">
                  <Icon className="text-white" size={26} />
                </div>
                <h3 className="text-xl font-bold text-[var(--brand-ink)] mb-3">{feature.title}</h3>
                <p className="text-slate-700 dark:text-slate-300">{feature.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
