'use client';

import { useState, useEffect } from 'react';
import { Menu, X, MessageSquare, GraduationCap } from 'lucide-react';

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
    { name: '02 // Clientes', href: '#clientes' },
    { name: '03 // Contacto', href: '#contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-6 transition-all duration-300">
      <nav 
        className={`w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-3 transition-all duration-500 rounded-full border overflow-visible ${
          scrolled 
            ? 'bg-white/85 backdrop-blur-2xl border-white/95 shadow-[0_10px_30px_rgb(0,0,0,0.06)]' 
            : 'bg-white/60 backdrop-blur-xl border-white/80 shadow-xs'
        }`}
      >
        {/* LOGOTIPO */}
        <a href="#" className="flex items-center group cursor-pointer relative py-0.5">
          <img
            src="/logo-netpro.png"
            alt="NetPro Digital Studio"
            className="h-10 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* NAVEGACIÓN DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-mono uppercase tracking-widest text-gray-700 hover:text-[#ff2a2a] transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* BOTONES DESKTOP - PORTAL CURSOS + WHATSAPP */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/cursos"
            className="inline-flex items-center gap-2 bg-[#ff2a2a] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-red-600 transition-all duration-300 shadow-md shadow-red-500/15 text-xs tracking-wider uppercase"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Portal Cursos</span>
          </a>
          <a
            href="https://wa.me/5627000847"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-all duration-300 shadow-md text-xs tracking-wider uppercase"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contacto</span>
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

      {/* MENÚ MÓVIL */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-6 right-6 bg-white/95 backdrop-blur-2xl rounded-3xl p-6 border border-white shadow-2xl flex flex-col gap-4 md:hidden z-50">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-mono uppercase tracking-widest text-gray-800 hover:text-[#ff2a2a] py-2 border-b border-gray-100 font-medium"
            >
              {link.name}
            </a>
          ))}
          <a
            href="/cursos"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#ff2a2a] text-white font-semibold py-3 rounded-full text-xs tracking-wider uppercase shadow-md shadow-red-500/20"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Portal Cursos</span>
          </a>
          <a
            href="https://wa.me/5627000847"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 rounded-full text-xs tracking-wider uppercase shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contacto WhatsApp</span>
          </a>
        </div>
      )}
    </header>
  );
}