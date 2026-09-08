'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '01 // Soluciones', href: '#servicios' },
    { name: '02 // Proyectos', href: '#proyectos' },
    { name: '03 // Liderazgo', href: '#autoridad' },
    { name: '04 // Contacto', href: '#contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-6 transition-all duration-300">
      <nav 
        className={`w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5 transition-all duration-500 rounded-full border ${
          scrolled 
            ? 'bg-white/70 backdrop-blur-xl border-white/90 shadow-[0_10px_30px_rgb(0,0,0,0.05)]' 
            : 'bg-white/50 backdrop-blur-md border-white/60 shadow-xs'
        }`}
      >
        {/* LOGOTIPO REAL NETPRO DIGITAL */}
        <a href="#" className="flex items-center gap-3 group cursor-pointer py-1">
          <div className="relative h-7 w-36">
            <Image
              src="/NETPROLOGO.PNG"
              alt="NetPro Digital"
              fill
              className="object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
              priority
            />
          </div>
        </a>

        {/* NAVEGACIÓN DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-mono uppercase tracking-widest text-gray-600 hover:text-[#ff2a2a] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* BOTÓN CTA */}
        <div className="hidden md:block">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 bg-[#ff2a2a] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-red-600 transition-all duration-300 shadow-md shadow-red-500/15 text-xs tracking-wider uppercase"
          >
            <span>Iniciar Proyecto</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-6 right-6 bg-white/90 backdrop-blur-2xl rounded-3xl p-6 border border-white shadow-2xl flex flex-col gap-4 md:hidden z-50">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-mono uppercase tracking-widest text-gray-800 hover:text-[#ff2a2a] py-2 border-b border-gray-100"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#ff2a2a] text-white font-semibold py-3 rounded-full text-xs tracking-wider uppercase shadow-md shadow-red-500/20"
          >
            <span>Iniciar Proyecto</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
}