import { CalendarClock, Layers3, GraduationCap, Building2 } from 'lucide-react';
import { Reveal } from './Reveal';

const stats = [
  {
    icon: Layers3,
    number: '3',
    label: 'Schools',
  },
  {
    icon: GraduationCap,
    number: '6',
    label: 'Courses',
  },
  {
    icon: CalendarClock,
    number: '3',
    label: 'Cohorts / Year',
  },
  {
    icon: Building2,
    number: '2',
    label: 'Hubs + Global Online',
  },
];

export function Stats() {
  return (
    <section className="py-20 bg-[var(--brand-ink)] dark:bg-[linear-gradient(160deg,#000b18,#001020)] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(219,231,243,0.6),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(240,128,16,0.45),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent,rgba(255,255,255,0.12))] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent,rgba(240,128,16,0.18))]" />
      <div className="absolute inset-0 texture-grid opacity-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Reveal delay={0} speed="slow">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">
              Built for Outcomes, Not Hype
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              A structured programme with clear schedules, real projects, and post-graduation support.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Reveal
                key={stat.label}
                delay={index * 120}
                speed="fast"
                className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 transition shadow-[0_25px_55px_rgba(0,0,0,0.35)] dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:shadow-[0_25px_55px_rgba(0,0,0,0.45)]"
              >
                <div className="w-16 h-16 mx-auto rounded-xl bg-white text-[var(--brand-ink)] flex items-center justify-center mb-6 shadow-[0_15px_40px_rgba(219,231,243,0.35)] dark:bg-white/95 dark:text-[#001020] dark:shadow-[0_18px_40px_rgba(240,128,16,0.45)]">
                  <Icon size={30} />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/70">{stat.label}</div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
          {[
            'Classes run Monday to Wednesday, 10:00am to 2:00pm WAT.',
            'Abeokuta is the primary live classroom. Lagos students join online from the facility.',
            'Online students get 15% tuition reduction with full programme parity.',
          ].map((note, index) => (
            <Reveal
              key={note}
              delay={index * 120}
              speed="fast"
              className="bg-white/10 border border-white/10 rounded-2xl p-6 text-sm text-white/80 dark:bg-white/5 dark:border-white/10"
            >
              {note}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
