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
    <nav className="top-0 z-40 fixed bg-[color:var(--brand-ink)]/95 shadow-[0_18px_40px_rgba(0,16,32,0.22)] backdrop-blur border-white/10 border-b w-full text-white">
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
                  ? "border-[var(--brand-orange)] border-b-2 pb-1 text-white"
                  : "border-b-2 border-transparent pb-1 text-white/80 hover:text-white"
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
              <button className="flex items-center gap-1 border-b-2 border-transparent pb-1 font-semibold text-white/80 hover:text-white text-sm transition-colors">
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
                  ? "border-[var(--brand-orange)] border-b-2 pb-1 text-white"
                  : "border-b-2 border-transparent pb-1 text-white/80 hover:text-white"
              }`}
            >
              Admissions
            </Link>

            <Link
              href="/resume-application"
              className={`text-sm font-semibold transition-colors ${
                isActivePath("/resume-application")
                  ? "border-[var(--brand-orange)] border-b-2 pb-1 text-white"
                  : "border-b-2 border-transparent pb-1 text-white/80 hover:text-white"
              }`}
            >
              Resume Application
            </Link>

            <div
              className="relative"
              onMouseEnter={handleAcademyEnter}
              onMouseLeave={handleAcademyLeave}
            >
              <button className="flex items-center gap-1 border-b-2 border-transparent pb-1 font-semibold text-white/80 hover:text-white text-sm transition-colors">
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
                  ? "border-[var(--brand-orange)] border-b-2 pb-1 text-white"
                  : "border-b-2 border-transparent pb-1 text-white/80 hover:text-white"
              }`}
            >
              Contact
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/admissions#apply"
                className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-strong)] shadow-[0_12px_30px_rgba(240,128,16,0.28)] hover:shadow-[0_16px_38px_rgba(240,128,16,0.35)] px-6 py-2.5 rounded-xl font-semibold text-white text-sm hover:scale-105 transition-all hover:-translate-y-0.5 transform"
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
              className="hover:bg-white/10 p-2 rounded-lg text-white/90 transition-colors"
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
          <div className="lg:hidden bg-[var(--brand-ink)] py-4 border-white/10 border-t">
            <div className="space-y-4">
              <ThemeToggle showLabel className="justify-center w-full" />
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-semibold ${
                  isActivePath("/")
                    ? "text-[var(--brand-orange)]"
                    : "text-white/85"
                }`}
              >
                Home
              </Link>

              <div>
                <div className="mb-2 font-semibold text-white text-sm">
                  Programs
                </div>
                <div className="space-y-2 pl-4">
                  {programs.map((program) => (
                    <Link
                      key={program.slug}
                      href={`/programs/${program.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block py-1 text-white/65 hover:text-white text-sm"
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
                    ? "text-[var(--brand-orange)]"
                    : "text-white/85"
                }`}
              >
                Admissions
              </Link>

              <Link
                href="/resume-application"
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-semibold ${
                  isActivePath("/resume-application")
                    ? "text-[var(--brand-orange)]"
                    : "text-white/85"
                }`}
              >
                Resume Application
              </Link>

              <div>
                <div className="mb-2 font-semibold text-white text-sm">
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
                      className="block py-1 text-white/65 hover:text-white text-sm"
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
                    ? "text-[var(--brand-orange)]"
                    : "text-white/85"
                }`}
              >
                Contact
              </Link>

              <Link
                href="/admissions#apply"
                onClick={() => setIsOpen(false)}
                className="block bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-strong)] shadow-[0_12px_30px_rgba(240,128,16,0.28)] px-6 py-3 rounded-xl font-semibold text-white text-sm text-center transition-all"
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
