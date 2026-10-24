'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import InteractiveCanvas from "@/app/components/InteractiveCanvas";
import FluidBackground from "@/app/components/FluidBackground";
import Navbar from "@/app/components/Navbar";
import NuestrosClientes from "@/app/components/NuestrosClientes";
import { 
  CheckCircle2, 
  Send, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Video, 
  Share2, 
  Compass, 
  Code2, 
  Target, 
  Clock, 
  Check 
} from "lucide-react";

const servicesData = [
  {
    id: "consultoria",
    number: "01",
    title: "Estrategia, Consultoría & Capacitación",
    description: "Diagnóstico comercial, escalado de embudos, talleres para empresas y programas de formación intensiva (1 a 1).",
    features: ["Auditoría de negocio", "Talleres corporativos y equipos", "Mentoría y cursos personalizados 1 a 1"],
    highlight: true,
    iconName: "TrendingUp"
  },
  {
    id: "contenido",
    number: "02",
    title: "Creación de Contenido",
    description: "Producción audiovisual y piezas gráficas diseñadas para capturar atención y retener audiencias.",
    features: ["Dirección de arte", "Edición de alto impacto", "Guiones comerciales"],
    highlight: false,
    iconName: "Video"
  },
  {
    id: "redes",
    number: "03",
    title: "Gestión Integral de Redes",
    description: "Operativa diaria, calendarización y posicionamiento de autoridad en tus plataformas clave.",
    features: ["Calendario editorial", "Community management", "Reportes de crecimiento"],
    highlight: false,
    iconName: "Share2"
  },
  {
    id: "branding",
    number: "04",
    title: "Branding e Identidad de Marca",
    description: "Construcción de marcas memorables, minimalistas y con un fuerte sentido de distinción en el mercado.",
    features: ["Manual de identidad", "Rediseño de marca", "Estrategia visual"],
    highlight: false,
    iconName: "Compass"
  },
  {
    id: "web",
    number: "05",
    title: "Diseño y Desarrollo Web Inmersivo",
    description: "Sitios web de ultra alta velocidad, interactivos y optimizados para la máxima conversión de leads.",
    features: ["Desarrollo Next.js / React", "Animaciones fluidas", "Optimización SEO técnica"],
    highlight: false,
    iconName: "Code2"
  },
  {
    id: "ads",
    number: "06",
    title: "Publicidad Digital (Meta Ads)",
    description: "Campañas de pauta hipersegmentadas orientadas a la generación de prospectos cualificados y retorno directo.",
    features: ["Estrategia de pauta", "Segmentación avanzada", "A/B Testing continuo"],
    highlight: false,
    iconName: "Target"
  }
];

const renderServiceIcon = (iconName: string) => {
  const props = { className: "w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" };
  switch (iconName) {
    case "TrendingUp": return <TrendingUp {...props} />;
    case "Video": return <Video {...props} />;
    case "Share2": return <Share2 {...props} />;
    case "Compass": return <Compass {...props} />;
    case "Code2": return <Code2 {...props} />;
    case "Target": return <Target {...props} />;
    default: return <TrendingUp {...props} />;
  }
};

const timeSlots = [
  "09:00 AM - 09:45 AM",
  "10:00 AM - 10:45 AM",
  "11:00 AM - 11:45 AM",
  "12:00 PM - 12:45 PM",
  "03:00 PM - 03:45 PM",
  "04:00 PM - 04:45 PM",
  "05:00 PM - 05:45 PM"
];

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
    }, 1000);
  };

  const handleBookingConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !clientName) return;
    
    const message = encodeURIComponent(`Hola, soy *${clientName}*. Quiero agendar una sesión estratégica de 45 minutos para el día *${selectedDate}* en el horario de *${selectedSlot}*. Quedo atento a la confirmación.`);
    window.open(`https://wa.me/525627000847?text=${message}`, '_blank');
    setIsBookingOpen(false);
  };

  return (
    <div className="relative min-h-screen text-[#111113] overflow-hidden selection:bg-[#ff2a2a] selection:text-white font-sans">
      
      <Navbar />
      <FluidBackground />
      <InteractiveCanvas />

      {/* HERO */}
      <section className="relative min-h-[95vh] flex items-center px-6 pt-44 pb-24 z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4.5 py-2 rounded-full bg-white/75 border border-white/90 shadow-sm backdrop-blur-md mb-8"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a2a] animate-ping"></span>
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-gray-800 font-bold">
                NetPro Digital Studio // High-End Agency
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-8 text-gray-900"
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
              className="text-base sm:text-lg text-gray-600 max-w-2xl font-normal leading-relaxed mb-12 tracking-wide"
            >
              Consultoría experta, creación de contenido, gestión de redes y sistemas de conversión diseñados para dominar tu mercado con autoridad absoluta.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <a
                href="https://wa.me/525627000847"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#ff2a2a] text-white font-semibold px-9 py-4 rounded-full hover:bg-red-600 transition-all duration-300 shadow-xl shadow-red-500/20 text-xs tracking-widest uppercase"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contacto</span>
              </a>
              
              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 bg-white/80 backdrop-blur-md text-gray-900 border border-white/90 font-semibold px-9 py-4 rounded-full hover:bg-white transition-all duration-300 text-xs tracking-widest uppercase shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#ff2a2a]" />
                <span>Agendar Sesión (45 min)</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENTO GRID DE PILARES */}
      <section id="servicios" className="py-28 px-6 relative z-10 bg-white/30 backdrop-blur-md">
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
              Consultoría directiva, talleres corporativos, programas personalizados y ejecución digital de alto rendimiento.
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
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex items-center justify-center text-gray-800 group-hover:bg-[#ff2a2a] group-hover:text-white transition-all duration-500">
                        {renderServiceIcon(service.iconName)}
                      </div>
                      <span className="text-4xl font-mono font-bold text-gray-300 group-hover:text-[#ff2a2a]/40 transition-colors">
                        {service.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#ff2a2a] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="border-t border-gray-200/50 pt-5">
                    <ul className="space-y-2">
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

      {/* SECCIÓN DINÁMICA SUPABASE DE NUESTROS CLIENTES */}
      <NuestrosClientes />

      {/* FORMULARIO DE CONTACTO */}
      <section id="contacto" className="py-28 px-6 relative z-10 border-t border-white/40 bg-transparent">
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-14 border border-white/90 shadow-[0_20px_50px_rgb(0,0,0,0.06)] relative">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono tracking-widest uppercase text-[#ff2a2a] bg-red-50/80 backdrop-blur-xs px-3 py-1 rounded-full border border-red-100 font-semibold">
              03 // Contacto Directo
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 text-gray-900">
              Contáctanos y empieza a crecer
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
                  Gracias por ponerte en contacto. Analizaremos tu propuesta y nos pondremos en contacto contigo en menos de 24 horas hábiles.
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
                    <option>01. Estrategia, Consultoría, Talleres & Cursos (1 a 1)</option>
                    <option>02. Creación de Contenido</option>
                    <option>03. Gestión Integral de Redes Sociales</option>
                    <option>04. Branding e Identidad de Marca</option>
                    <option>05. Diseño y Desarrollo Web Inmersivo</option>
                    <option>06. Publicidad Digital (Meta Ads)</option>
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

      {/* CALENDARIO MODAL */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-2xl border border-white p-8 rounded-[2rem] max-w-lg w-full shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#ff2a2a] font-semibold">Reserva Directa</span>
                <h3 className="text-xl font-extrabold text-gray-900">Sesión Estratégica (45 min)</h3>
              </div>
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingConfirm} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-1.5 font-medium">Tu Nombre o Empresa</label>
                <input 
                  type="text" 
                  required 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Carlos Mendoza (Nexus Corp)" 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#ff2a2a]" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-1.5 font-medium">Selecciona el Día</label>
                  <input 
                    type="date" 
                    required 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#ff2a2a]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-600 mb-1.5 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#ff2a2a]" /> Bloque de 45 min
                  </label>
                  <select
                    required
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#ff2a2a]"
                  >
                    <option value="">Selecciona hora...</option>
                    {timeSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4 text-xs text-gray-600 leading-relaxed">
                💡 Al confirmar, se abrirá WhatsApp con los detalles de tu cita de 45 minutos listos para enviar a nuestro equipo de asesores.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="w-1/2 bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#ff2a2a] text-white font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Agendar Cita</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/40 bg-white/50 backdrop-blur-md text-center text-xs font-mono text-gray-500 relative z-10">
        <p>© {new Date().getFullYear()} NetPro Digital Studio. Todos los derechos reservados. Diseñado para la excelencia.</p>
      </footer>

    </div>
  );
}