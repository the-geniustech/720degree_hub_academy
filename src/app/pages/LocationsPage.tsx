'use client';

import { MapPin, Wifi, Zap } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useProgrammesData } from '../components/ProgrammesProvider';

const icons = [MapPin, Wifi, Zap];

export function LocationsPage() {
  const { data } = useProgrammesData();
  const locations = data.locations;
  return (
    <div className="pt-20">
      <section className="py-20 bg-[var(--brand-sand)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(154,210,255,0.35),_transparent_60%)]" />
        <div className="absolute inset-0 texture-grid opacity-30" />
        <div className="absolute inset-0 texture-noise opacity-20 mix-blend-multiply" />
        <div className="absolute -top-16 left-10 h-36 w-36 rounded-full bg-[rgba(239,107,93,0.25)] blur-3xl parallax-slow" />
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <Reveal delay={0}>
            <h1 className="text-5xl font-bold text-[var(--brand-ink)] mb-6 font-display">Locations & Access</h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Learn onsite in Abeokuta, connect from the Lagos facility, or join fully online with complete
              programme parity.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute right-10 bottom-10 h-32 w-32 rounded-full bg-[rgba(246,176,66,0.22)] blur-3xl parallax-medium" />
        <div className="absolute inset-0 texture-dots opacity-25" />
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 relative z-10">
          {locations.map((location, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Reveal
                key={location.id}
                delay={index * 120}
                className="bg-[var(--brand-sand)] border border-black/10 rounded-2xl p-8 shadow-[0_22px_50px_rgba(11,16,32,0.12)] hover:shadow-[0_32px_70px_rgba(11,16,32,0.18)] transition transform-gpu hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(1deg)_rotateY(-1deg)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-ink)] text-white flex items-center justify-center mb-6 shadow-[0_12px_30px_rgba(11,16,32,0.25)]">
                  <Icon size={22} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--brand-ink)] mb-3 font-display">{location.label}</h3>
                <p className="text-slate-700 mb-6">{location.description}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {location.perks.map((perk) => (
                    <li key={perk}>- {perk}</li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
