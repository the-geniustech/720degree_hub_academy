'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Reveal } from './Reveal';
import { useProgrammesData } from './ProgrammesProvider';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const programsCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const academyCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const { data } = useProgrammesData();
  const programs = data.programs;

  const handleProgramsEnter = () => {
    if (programsCloseTimeout.current) {
      clearTimeout(programsCloseTimeout.current);
      programsCloseTimeout.current = null;
    }
    setIsProgramsOpen(true);
  };

  const handleProgramsLeave = () => {
    if (programsCloseTimeout.current) {
      clearTimeout(programsCloseTimeout.current);
    }
    programsCloseTimeout.current = setTimeout(() => {
      setIsProgramsOpen(false);
    }, 240);
  };

  const handleAcademyEnter = () => {
    if (academyCloseTimeout.current) {
      clearTimeout(academyCloseTimeout.current);
      academyCloseTimeout.current = null;
    }
    setIsAcademyOpen(true);
  };

  const handleAcademyLeave = () => {
    if (academyCloseTimeout.current) {
      clearTimeout(academyCloseTimeout.current);
    }
    academyCloseTimeout.current = setTimeout(() => {
      setIsAcademyOpen(false);
    }, 240);
  };

  const isActivePath = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full z-40 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="https://720degreehub.com/academy/img/logo/720academylogo%20.png"
              alt="720Degree Innovation Hub"
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors ${
                isActivePath('/')
                  ? 'text-[var(--brand-ink)]'
                  : 'text-slate-700 hover:text-[var(--brand-ink)]'
              }`}
            >
              Home
            </Link>

            {/* Programs Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleProgramsEnter}
              onMouseLeave={handleProgramsLeave}
            >
              <button className="text-sm font-semibold text-slate-700 hover:text-[var(--brand-ink)] transition-colors flex items-center gap-1">
                Programs
                <ChevronDown className={`w-4 h-4 transition-transform ${isProgramsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProgramsOpen && (
                <div onMouseEnter={handleProgramsEnter} onMouseLeave={handleProgramsLeave}>
                  <Reveal
                    delay={0}
                    speed="fast"
                    className="absolute top-full left-0 mt-3 w-80 bg-card rounded-2xl shadow-xl border border-border py-2 z-50"
                  >
                    {programs.map((program, index) => (
                      <Reveal
                        key={program.slug}
                        delay={index * 60}
                        speed="fast"
                        className="block"
                      >
                        <Link
                          href={`/programs/${program.slug}`}
                          className="block px-6 py-3 hover:bg-[var(--brand-sand)] transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground group-hover:text-[var(--brand-ink)]">
                              {program.title}
                            </span>
                            <span className="text-xs text-slate-500">6 months</span>
                          </div>
                        </Link>
                      </Reveal>
                    ))}
                  </Reveal>
                </div>
              )}
            </div>

            <Link
              href="/admissions"
              className={`text-sm font-semibold transition-colors ${
                isActivePath('/admissions')
                  ? 'text-[var(--brand-ink)]'
                  : 'text-slate-700 hover:text-[var(--brand-ink)]'
              }`}
            >
              Admissions
            </Link>

            <div
              className="relative"
              onMouseEnter={handleAcademyEnter}
              onMouseLeave={handleAcademyLeave}
            >
              <button className="text-sm font-semibold text-slate-700 hover:text-[var(--brand-ink)] transition-colors flex items-center gap-1">
                Academy
                <ChevronDown className={`w-4 h-4 transition-transform ${isAcademyOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAcademyOpen && (
                <div onMouseEnter={handleAcademyEnter} onMouseLeave={handleAcademyLeave}>
                  <Reveal
                    delay={0}
                    speed="fast"
                    className="absolute top-full left-0 mt-3 w-56 bg-card rounded-2xl shadow-xl border border-border py-2 z-50"
                  >
                    {[
                      { href: '/about', label: 'About' },
                      { href: '/tuition', label: 'Tuition' },
                      { href: '/locations', label: 'Locations' },
                    ].map((item, index) => (
                      <Reveal key={item.href} delay={index * 60} speed="fast" className="block">
                        <Link
                          href={item.href}
                          className="block px-6 py-3 hover:bg-[var(--brand-sand)] transition-colors text-sm font-semibold text-foreground"
                        >
                          {item.label}
                        </Link>
                      </Reveal>
                    ))}
                  </Reveal>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className={`text-sm font-semibold transition-colors ${
                isActivePath('/contact')
                  ? 'text-[var(--brand-ink)]'
                  : 'text-slate-700 hover:text-[var(--brand-ink)]'
              }`}
            >
              Contact
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/admissions#apply"
                className="px-6 py-2.5 rounded-xl bg-[var(--brand-ink)] text-white text-sm font-semibold hover:bg-black transition-all transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                Apply Now
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle size="sm" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border bg-background">
            <div className="space-y-4">
              <ThemeToggle showLabel className="w-full justify-center" />
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-semibold ${
                  isActivePath('/')
                    ? 'text-[var(--brand-ink)]'
                    : 'text-slate-700'
                }`}
              >
                Home
              </Link>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Programs</div>
                <div className="pl-4 space-y-2">
                  {programs.map((program) => (
                    <Link
                      key={program.slug}
                      href={`/programs/${program.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block py-1 text-sm text-slate-600 hover:text-[var(--brand-ink)]"
                    >
                      {program.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/admissions"
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-semibold ${
                  isActivePath('/admissions')
                    ? 'text-[var(--brand-ink)]'
                    : 'text-slate-700'
                }`}
              >
                Admissions
              </Link>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Academy</div>
                <div className="pl-4 space-y-2">
                  {[
                    { href: '/about', label: 'About' },
                    { href: '/tuition', label: 'Tuition' },
                    { href: '/locations', label: 'Locations' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-1 text-sm text-slate-600 hover:text-[var(--brand-ink)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-semibold ${
                  isActivePath('/contact')
                    ? 'text-[var(--brand-ink)]'
                    : 'text-slate-700'
                }`}
              >
                Contact
              </Link>

              <Link
                href="/admissions#apply"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-3 rounded-xl bg-[var(--brand-ink)] text-white text-sm font-semibold text-center hover:bg-black transition-all shadow-md"
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
