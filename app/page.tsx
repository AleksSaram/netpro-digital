'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import InteractiveCanvas from "@/app/components/InteractiveCanvas";
import FluidBackground from "@/app/components/FluidBackground";
import BackgroundO3D from "@/app/components/BackgroundO3D";
import Navbar from "@/app/components/Navbar";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Send, 
  Terminal, 
  Calendar, 
  TrendingUp, 
  Video, 
  Share2, 
  Compass, 
  Code2, 
  Target, 
  Users, 
  Cpu 
} from "lucide-react";
import { servicesData } from "@/app/lib/servicesData";
import { projectsData } from "@/app/lib/projectsData";

// Función auxiliar para renderizar el icono correspondiente a cada pilar
const renderServiceIcon = (iconName: string) => {
  const props = { className: "w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" };
  switch (iconName) {
    case "TrendingUp": return <TrendingUp {...props} />;
    case "Video": return <Video {...props} />;
    case "Share2": return <Share2 {...props} />;
    case "Compass": return <Compass {...props} />;
    case "Code2": return <Code2 {...props} />;
    case "Target": return <Target {...props} />;
    case "Users": return <Users {...props} />;
    case "Cpu": return <Cpu {...props} />;
    default: return <TrendingUp {...props} />;
  }
};

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
    }, 1000);
  };

  // Filtrado de proyectos según la categoría activa
  const filteredProjects = activeCategory === 'all' 
    ? projectsData 
    : projectsData.filter(project => project.categoryKey === activeCategory);

  return (
    <div className="relative min-h-screen text-[#111113] overflow-hidden selection:bg-[#ff2a2a] selection:text-white font-sans">
      
      {/* NAVBAR FLOTANTE CON LIQUID GLASS */}
      <Navbar />

      {/* CAPAS DE FONDO */}
      <FluidBackground />
      <BackgroundO3D />
      <InteractiveCanvas />

      {/* ================= HERO STUDIO ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-36 pb-20 z-10">
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-8"
          >
            <Terminal className="w-3.5 h-3.5 text-[#ff2a2a]" />
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-gray-700 font-semibold">
              NetPro Digital Studio // Estrategia y Crecimiento
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-gray-900 max-w-5xl mx-auto"
          >
            Elevando marcas mediante <br className="hidden sm:inline"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-[#ff2a2a]">
              estrategia digital y web inmersivas
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed mb-12 tracking-wide"
          >
            Consultoría experta, creación de contenido, gestión de redes y sistemas de conversión diseñados para dominar tu mercado con autoridad absoluta.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#contacto"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ff2a2a] text-white font-semibold px-8 py-4 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/20 text-xs tracking-widest uppercase"
            >
              <span>Iniciar Proyecto</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            
            <a
              href="https://cal.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md text-gray-900 border border-white/80 font-semibold px-8 py-4 rounded-full hover:bg-white/80 transition-all duration-300 text-xs tracking-widest uppercase shadow-xs"
            >
              <Calendar className="w-4 h-4 text-[#ff2a2a]" />
              <span>Agendar Sesión (15 min)</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* ================= BENTO GRID DE LOS 8 PILARES (CON ICONOS MINIMALISTAS ANIMADOS) ================= */}
      <section id="servicios" className="py-28 px-6 relative z-10 border-t border-white/40 bg-white/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#ff2a2a] bg-red-50/80 backdrop-blur-xs px-3 py-1 rounded-full border border-red-100 font-semibold">
                01 // Ecosistema y Soluciones
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 text-gray-900">
                Nuestros Pilares de Servicio
              </h2>
            </div>
            <p className="text-gray-600 max-w-md text-sm leading-relaxed">
              Desde la consultoría directiva y creación de contenido hasta la formación de equipos de alto rendimiento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service, index) => (
              <Tilt
                key={service.id}
                tiltMaxAngleX={4}
                tiltMaxAngleY={4}
                perspective={1000}
                transitionSpeed={1000}
                scale={1.01}
                className="h-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`h-full group bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-red-300 hover:shadow-[0_12px_40px_rgb(255,42,42,0.1)] transition-all duration-500 flex flex-col justify-between ${
                    service.highlight ? "lg:col-span-2 bg-gradient-to-br from-white/70 via-white/50 to-red-50/30" : ""
                  }`}
                >
                  <div>
                    {/* CABECERA DE LA TARJETA: ICONO ANIMADO Y NÚMERO */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex items-center justify-center text-gray-800 group-hover:bg-[#ff2a2a] group-hover:text-white transition-all duration-500">
                        {renderServiceIcon(service.iconName)}
                      </div>
                      <span className="text-4xl font-mono font-bold text-gray-300 group-hover:text-[#ff2a2a]/40 transition-colors">
                        {service.number}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#ff2a2a] transition-colors">
                        {service.title}
                      </h3>
                      <div className="w-8 h-8 rounded-xl bg-white/50 backdrop-blur-xs flex items-center justify-center group-hover:bg-[#ff2a2a] group-hover:text-white transition-all duration-300 border border-white/60 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 flex-shrink-0">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                      {service.description}
                    </p>
                  </div>

                  <div className="border-t border-gray-200/50 pt-6">
                    <ul className="space-y-2.5">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs font-medium text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-[#ff2a2a] flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>

        </div>
      </section>

      {/* ================= CASOS DE ESTUDIO (CON FILTROS INTERACTIVOS) ================= */}
      <section id="proyectos" className="py-28 px-6 relative z-10 border-t border-white/40 bg-transparent">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#ff2a2a] bg-red-50/80 backdrop-blur-xs px-3 py-1 rounded-full border border-red-100 font-semibold">
                02 // Casos de Estudio
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 text-gray-900">
                Impacto Comprobado
              </h2>
            </div>
            <p className="text-gray-600 max-w-md text-sm leading-relaxed">
              Desarrollos recientes diseñados bajo los más altos estándares de estrategia, tecnología y conversión digital.
            </p>
          </div>

          {/* PESTAÑAS DE FILTRADO */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {[
              { key: 'all', label: 'Todos los Proyectos' },
              { key: 'web', label: 'Web & Inmersivo' },
              { key: 'realestate', label: 'Real Estate' },
              { key: 'branding', label: 'Branding & Video' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-medium backdrop-blur-md border transition-all duration-300 cursor-pointer ${
                  activeCategory === tab.key
                    ? 'bg-[#ff2a2a] text-white border-[#ff2a2a] shadow-md shadow-red-500/20'
                    : 'bg-white/70 border-white text-gray-700 hover:border-[#ff2a2a] hover:text-[#ff2a2a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* GRID DE PROYECTOS DINÁMICO */}
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(255,42,42,0.08)] hover:border-red-200 transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Botón flotante al hacer hover si el proyecto tiene enlace */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-full text-xs tracking-wider uppercase shadow-lg hover:bg-[#ff2a2a] hover:text-white transition-colors"
                        >
                          <span>Visitar Proyecto</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white shadow-xs">
                      <span className="text-[11px] font-mono font-bold text-[#ff2a2a] tracking-wider uppercase">
                        {project.metrics}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                        {project.number} // {project.category}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#ff2a2a] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200/50">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="text-[11px] font-mono bg-white/70 backdrop-blur-xs border border-white px-3 py-1 rounded-full text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* ================= SECCIÓN DE AUTORIDAD & ESTUDIO ================= */}
      <section id="autoridad" className="py-28 px-6 relative z-10 border-t border-white/40 bg-white/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-6">
              <span className="text-xs font-mono tracking-widest uppercase text-[#ff2a2a] bg-red-50/80 backdrop-blur-xs px-3 py-1 rounded-full border border-red-100 font-semibold">
                03 // Liderazgo y Visión
              </span>
              
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-6 mb-6 leading-tight text-gray-900">
                Estrategia de precisión unida a un diseño sin concesiones.
              </h2>
              
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Liderado por <strong className="text-gray-900 font-medium">Ricardo Zúñiga</strong>, NetPro Digital Studio fusiona consultoría de negocio pura con ejecución creativa de alto nivel. Cada proyecto se diseña para que tu marca mande con autoridad.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200/60">
                <div>
                  <span className="block text-3xl font-extrabold text-gray-900 mb-1">100%</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-gray-500">Enfoque Estratégico</span>
                </div>
                <div>
                  <span className="block text-3xl font-extrabold text-[#ff2a2a] mb-1">Boutique</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-gray-500">Acompañamiento 1 a 1</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white bg-white/60 backdrop-blur-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" 
                    alt="Global Studio Workspace" 
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                    <span className="text-xs font-mono tracking-widest text-[#ff2a2a] uppercase mb-1 font-semibold">Estándar de Ejecución</span>
                    <p className="text-xl font-bold">Diseñado para marcas que se niegan a pasar desapercibidas.</p>
                  </div>
                </div>
              </Tilt>
            </div>

          </div>

        </div>
      </section>

      {/* ================= CONTACTO STUDIO (LIQUID GLASS CARD) ================= */}
      <section id="contacto" className="py-28 px-6 relative z-10 border-t border-white/40 bg-transparent">
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-14 border border-white/90 shadow-[0_20px_50px_rgb(0,0,0,0.06)] relative">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono tracking-widest uppercase text-[#ff2a2a] bg-red-50/80 backdrop-blur-xs px-3 py-1 rounded-full border border-red-100 font-semibold">
              04 // Contacto Directo
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 text-gray-900">
              Construyamos Algo Icónico
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-16 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-red-50 text-[#ff2a2a] rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Brief Recibido con Éxito</h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
                  Gracias por ponerte en contacto. Ricardo Zúñiga analizará tu propuesta y se pondrá en contacto contigo en menos de 24 horas hábiles.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 inline-flex items-center justify-center text-xs font-mono tracking-widest uppercase text-[#ff2a2a] font-semibold hover:underline cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-2 font-medium">Tu Nombre</label>
                    <input type="text" required placeholder="Carlos Mendoza" className="w-full px-4 py-3.5 rounded-xl bg-white/70 backdrop-blur-xs border border-white text-gray-900 text-sm focus:outline-none focus:border-[#ff2a2a] shadow-inner transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-2 font-medium">Correo Electrónico</label>
                    <input type="email" required placeholder="carlos@company.com" className="w-full px-4 py-3.5 rounded-xl bg-white/70 backdrop-blur-xs border border-white text-gray-900 text-sm focus:outline-none focus:border-[#ff2a2a] shadow-inner transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-2 font-medium">Área de Interés Principal</label>
                  <select className="w-full px-4 py-3.5 rounded-xl bg-white/70 backdrop-blur-xs border border-white text-gray-900 text-sm focus:outline-none focus:border-[#ff2a2a] shadow-inner transition-colors">
                    <option>01. Estrategia y Consultoría Digital</option>
                    <option>02. Creación de Contenido para Redes</option>
                    <option>03. Gestión Integral de Redes Sociales</option>
                    <option>04. Branding e Identidad de Marca</option>
                    <option>05. Diseño y Desarrollo Web Inmersivo</option>
                    <option>06. Publicidad Digital (Meta Ads)</option>
                    <option>07. Talleres para Empresas y Equipos</option>
                    <option>08. Cursos y Capacitaciones (1 a 1 / Programas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-2 font-medium">Resumen del Proyecto u Objetivo</label>
                  <textarea rows={4} required placeholder="Cuéntanos sobre tus metas y visión actual..." className="w-full px-4 py-3.5 rounded-xl bg-white/70 backdrop-blur-xs border border-white text-gray-900 text-sm focus:outline-none focus:border-[#ff2a2a] shadow-inner transition-colors resize-none"></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ff2a2a] text-white font-semibold py-4 rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 text-xs tracking-widest uppercase cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span className="animate-pulse">Procesando solicitud...</span>
                  ) : (
                    <>
                      <span>Enviar Propuesta</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/40 bg-white/50 backdrop-blur-md text-center text-xs font-mono text-gray-500 relative z-10">
        <p>© {new Date().getFullYear()} NetPro Digital Studio. Todos los derechos reservados. Diseñado para la excelencia.</p>
      </footer>

    </div>
  );
}