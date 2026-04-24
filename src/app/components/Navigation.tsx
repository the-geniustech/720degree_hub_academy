"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";
import { useProgrammesData } from "./ProgrammesProvider";
import { ThemeToggle } from "./ThemeToggle";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const programsCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const academyCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
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
    <nav className="top-0 z-40 fixed bg-background/90 backdrop-blur border-border border-b w-full">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="https://720Degreehub.com/academy/img/logo/720academylogo%20.png"
              alt="720Degree Innovation Hub"
              className="w-auto h-12 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors ${
                isActivePath("/")
                  ? "text-[var(--brand-ink)]"
                  : "text-slate-700 hover:text-[var(--brand-ink)]"
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
              <button className="flex items-center gap-1 font-semibold text-slate-700 hover:text-[var(--brand-ink)] text-sm transition-colors">
                Programs
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isProgramsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProgramsOpen && (
                <div
                  onMouseEnter={handleProgramsEnter}
                  onMouseLeave={handleProgramsLeave}
                >
                  <Reveal
                    delay={0}
                    speed="fast"
                    className="top-full left-0 z-50 absolute bg-card shadow-xl mt-3 py-2 border border-border rounded-2xl w-80"
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
                          className="group block hover:bg-[var(--brand-sand)] px-6 py-3 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-foreground group-hover:text-[var(--brand-ink)] text-sm">
                              {program.title}
                            </span>
                            <span className="text-slate-500 text-xs">
                              6 months
                            </span>
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
                isActivePath("/admissions")
                  ? "text-[var(--brand-ink)]"
                  : "text-slate-700 hover:text-[var(--brand-ink)]"
              }`}
            >
              Admissions
            </Link>

            <Link
              href="/resume-application"
              className={`text-sm font-semibold transition-colors ${
                isActivePath("/resume-application")
                  ? "text-[var(--brand-ink)]"
                  : "text-slate-700 hover:text-[var(--brand-ink)]"
              }`}
            >
              Resume Application
            </Link>

            <div
              className="relative"
              onMouseEnter={handleAcademyEnter}
              onMouseLeave={handleAcademyLeave}
            >
              <button className="flex items-center gap-1 font-semibold text-slate-700 hover:text-[var(--brand-ink)] text-sm transition-colors">
                Academy
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isAcademyOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isAcademyOpen && (
                <div
                  onMouseEnter={handleAcademyEnter}
                  onMouseLeave={handleAcademyLeave}
                >
                  <Reveal
                    delay={0}
                    speed="fast"
                    className="top-full left-0 z-50 absolute bg-card shadow-xl mt-3 py-2 border border-border rounded-2xl w-56"
                  >
                    {[
                      { href: "/about", label: "About" },
                      { href: "/tuition", label: "Tuition" },
                      { href: "/locations", label: "Locations" },
                    ].map((item, index) => (
                      <Reveal
                        key={item.href}
                        delay={index * 60}
                        speed="fast"
                        className="block"
                      >
                        <Link
                          href={item.href}
                          className="block hover:bg-[var(--brand-sand)] px-6 py-3 font-semibold text-foreground text-sm transition-colors"
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
                isActivePath("/contact")
                  ? "text-[var(--brand-ink)]"
                  : "text-slate-700 hover:text-[var(--brand-ink)]"
              }`}
            >
              Contact
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/admissions#apply"
                className="bg-[var(--brand-ink)] hover:bg-black shadow-md hover:shadow-lg px-6 py-2.5 rounded-xl font-semibold text-white text-sm hover:scale-105 transition-all hover:-translate-y-0.5 transform"
              >
                Apply Now
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle size="sm" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-black/5 p-2 rounded-lg text-slate-700 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-background py-4 border-border border-t">
            <div className="space-y-4">
              <ThemeToggle showLabel className="justify-center w-full" />
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-semibold ${
                  isActivePath("/")
                    ? "text-[var(--brand-ink)]"
                    : "text-slate-700"
                }`}
              >
                Home
              </Link>

              <div>
                <div className="mb-2 font-semibold text-slate-700 text-sm">
                  Programs
                </div>
                <div className="space-y-2 pl-4">
                  {programs.map((program) => (
                    <Link
                      key={program.slug}
                      href={`/programs/${program.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block py-1 text-slate-600 hover:text-[var(--brand-ink)] text-sm"
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
                  isActivePath("/admissions")
                    ? "text-[var(--brand-ink)]"
                    : "text-slate-700"
                }`}
              >
                Admissions
              </Link>

              <Link
                href="/resume-application"
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-semibold ${
                  isActivePath("/resume-application")
                    ? "text-[var(--brand-ink)]"
                    : "text-slate-700"
                }`}
              >
                Resume Application
              </Link>

              <div>
                <div className="mb-2 font-semibold text-slate-700 text-sm">
                  Academy
                </div>
                <div className="space-y-2 pl-4">
                  {[
                    { href: "/about", label: "About" },
                    { href: "/tuition", label: "Tuition" },
                    { href: "/locations", label: "Locations" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-1 text-slate-600 hover:text-[var(--brand-ink)] text-sm"
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
                  isActivePath("/contact")
                    ? "text-[var(--brand-ink)]"
                    : "text-slate-700"
                }`}
              >
                Contact
              </Link>

              <Link
                href="/admissions#apply"
                onClick={() => setIsOpen(false)}
                className="block bg-[var(--brand-ink)] hover:bg-black shadow-md px-6 py-3 rounded-xl font-semibold text-white text-sm text-center transition-all"
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
