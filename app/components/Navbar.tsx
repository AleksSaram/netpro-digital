'use client';

import { useState, useEffect } from 'react';
import { Menu, X, MessageSquare, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '01 // Soluciones', href: '/#servicios' },
    { name: '02 // Clientes', href: '/#clientes' },
    { name: '03 // Contacto', href: '/#contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-6">
      <nav 
        className={`w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-300 overflow-visible ${
          scrolled 
            ? 'bg-white/95 border-white shadow-[0_10px_30px_rgb(0,0,0,0.06)] md:bg-white/85 md:backdrop-blur-xl md:border-white/95' 
            : 'bg-white/90 border-white/80 shadow-sm md:bg-white/60 md:backdrop-blur-md'
        }`}
      >
        <a href="/" className="flex items-center group cursor-pointer">
          <img src="/logo-netpro.png" alt="NetPro Digital Studio" className="h-10 sm:h-13 w-auto object-contain"/>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-xs font-mono uppercase tracking-widest text-gray-700 hover:text-[#ff2a2a] font-medium">{link.name}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a href="/cursos" className="inline-flex items-center gap-2 bg-[#ff2a2a] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-red-600 text-xs uppercase"><GraduationCap className="w-3.5 h-3.5" /><span>Portal Cursos</span></a>
          <a href="https://wa.me/5627000847" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-black text-xs uppercase"><MessageSquare className="w-3.5 h-3.5" /><span>Contacto</span></a>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl text-gray-700">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>
      {mobileMenuOpen && (
        <div className="absolute top-20 left-6 right-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl flex flex-col gap-4 md:hidden z-50">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-sm font-mono uppercase tracking-widest text-gray-800 py-2 border-b border-gray-100 font-medium">{link.name}</a>
          ))}
          <a href="/cursos" onClick={() => setMobileMenuOpen(false)} className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#ff2a2a] text-white font-semibold py-3 rounded-full text-xs uppercase"><GraduationCap className="w-4 h-4" /><span>Portal Cursos</span></a>
          <a href="https://wa.me/5627000847" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 rounded-full text-xs uppercase"><MessageSquare className="w-4 h-4" /><span>Contacto WhatsApp</span></a>
        </div>
      )}
    </header>
  );
}

