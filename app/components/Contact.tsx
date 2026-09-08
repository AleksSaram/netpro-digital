'use client';

import { Mail, Send, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <section id="contacto" className="py-24 px-6 bg-[#f8f9fa] relative border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Columna Izquierda: Información y Propuesta Directa */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-pulse"></span>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#ff2a2a]">
                Inicia Tu Transformación
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              ¿Listo para que tu marca <span className="text-[#ff2a2a]">sea la elegida</span>?
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Hablemos sobre tu proyecto. Ya sea que necesites una consultoría estratégica, rediseñar tu ecosistema digital o capacitar a tu equipo, en NetPro estamos listos para construir autoridad para tu negocio.
            </p>

            {/* Datos de contacto rápidos */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#ff2a2a]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Correo Electrónico</span>
                  <span className="text-gray-900 font-medium">contacto@netprodigital.com</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#ff2a2a]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Atención Directa</span>
                  <span className="text-gray-900 font-medium">Consultoría personalizada 1 a 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Contacto Minimalista */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl relative">
            
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h3>

            <form onSubmit={(e) => { e.preventDefault(); alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto."); }} className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Carlos Mendoza"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f8f9fa] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#ff2a2a] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="carlos@tuempresa.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f8f9fa] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#ff2a2a] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  ¿En qué podemos ayudarte?
                </label>
                <select 
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f8f9fa] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#ff2a2a] transition-colors"
                >
                  <option>Estrategia y Consultoría Digital</option>
                  <option>Creación de Contenido & Redes</option>
                  <option>Diseño y Desarrollo Web</option>
                  <option>Publicidad Digital (Meta Ads)</option>
                  <option>Talleres y Cursos para Equipos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Cuéntanos sobre tu objetivo
                </label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Describe brevemente tu negocio y lo que buscas lograr..."
                  className="w-full px-4 py-3.5 rounded-xl bg-[#f8f9fa] border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#ff2a2a] transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff2a2a] text-white font-medium py-4 rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enviar Solicitud</span>
                <Send className="w-4 h-4" />
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}