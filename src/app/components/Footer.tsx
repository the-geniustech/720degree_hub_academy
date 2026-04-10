'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Reveal } from './Reveal';
import { useProgrammesData } from './ProgrammesProvider';

export function Footer() {
  const { data } = useProgrammesData();
  const programs = data.programs;
  return (
    <footer className="bg-[var(--brand-ink)] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <Reveal delay={0} speed="slow" className="md:col-span-2">
            <div className="mb-4">
              <img
                src="https://720degreehub.com/academy/img/logo/720academylogo%20.png"
                alt="720Degree Innovation Hub"
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/70 mb-6 max-w-xl">
              720degree Innovation Hub delivers AI-integrated, expert-led tech education with real projects,
              business modules, and global access from Abeokuta and Lagos.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-white/70">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info@720degreehub.com</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+234 800 720 TECH</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Abeokuta (Primary) & Lagos, Nigeria</span>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition">
                <Youtube size={20} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={140} speed="fast">
            <h4 className="font-bold mb-4 text-lg">Programs</h4>
            <ul className="space-y-3 text-white/70">
              {programs.map((program) => (
                <li key={program.slug}>
                  <Link href={`/programs/${program.slug}`} className="hover:text-white transition">
                    {program.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={220} speed="fast">
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-white/70">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/admissions" className="hover:text-white transition">Admissions</Link></li>
              <li><Link href="/tuition" className="hover:text-white transition">Tuition</Link></li>
              <li><Link href="/locations" className="hover:text-white transition">Locations</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </Reveal>
        </div>

        <div className="border-t border-white/10 pt-8">
          <Reveal delay={280} speed="fast">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
              <p>&copy; 2026 720Degree Innovation Hub. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                <a href="#" className="hover:text-white transition">Terms of Service</a>
                <a href="#" className="hover:text-white transition">Cookie Policy</a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
