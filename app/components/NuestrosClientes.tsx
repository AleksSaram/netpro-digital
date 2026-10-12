'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, Client, CategoriaCliente } from '@/app/lib/supabase';
import { ArrowUpRight, X, Globe, Play } from 'lucide-react';

const categorias: (CategoriaCliente | 'Todos')[] = ['Todos', 'Medicina', 'Educación', 'Marcas Personales', 'Multinivel', 'Belleza', 'Eventos'];

const getDemoLabel = (tipo: string) => {
  switch(tipo) {
    case 'web': return 'Ver Sitio Web';
    case 'video': return 'Ver Video / Reel';
    case 'feed': return 'Ver Feed de Contenido';
    case 'branding': return 'Ver Branding';
    default: return 'Ver Trabajo';
  }
};

const getDemoIcon = (tipo: string) => {
  switch(tipo) {
    case 'video': return <Play className="w-4 h-4" />;
    case 'web': return <Globe className="w-4 h-4" />;
    default: return <ArrowUpRight className="w-4 h-4" />;
  }
};

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function NuestrosClientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeCat, setActiveCat] = useState<CategoriaCliente | 'Todos'>('Todos');
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (!error && data) setClients(data as any[]);
    setLoading(false);
  };

  const filtered = activeCat === 'Todos' ? clients : clients.filter((c: any) => c.categoria === activeCat);

  return (
    <section id="clientes" className="py-28 px-6 relative z-10 border-t border-white/40 bg-white/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-[#ff2a2a] bg-red-50/80 px-3 py-1 rounded-full border border-red-100 font-semibold">
              02 // Nuestros Clientes
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 text-gray-900">
              Nuestros Clientes
            </h2>
          </div>
          <p className="text-gray-600 max-w-md text-sm leading-relaxed">
            Filtrados por tipo de industria. Cada tarjeta muestra qué hicimos, redes y demo real del trabajo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                activeCat === cat 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
                  : 'bg-white/60 backdrop-blur-md text-gray-700 border-white/80 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[380px] bg-white/60 rounded-3xl animate-pulse border border-white" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((client: any) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white/75 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => setSelected(client)}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={client.imagen_url} alt={client.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white">
                    <span className="text-[10px] font-mono font-bold text-[#ff2a2a] uppercase">{client.categoria}</span>
                  </div>
                  {client.metrica && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg">
                      <span className="text-[11px] font-mono text-white font-medium">{client.metrica}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <span className="text-[9px] font-mono text-white uppercase">{client.demo_tipo}</span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#ff2a2a] transition-colors">{client.nombre}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-2 line-clamp-2">{client.descripcion}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {client.servicios.slice(0,3).map((s: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-mono bg-gray-100 border border-gray-200 px-2 py-1 rounded-full text-gray-700">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-gray-500 flex items-center gap-1">{getDemoIcon(client.demo_tipo)} {getDemoLabel(client.demo_tipo)}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff2a2a]">Ver trabajo <ArrowUpRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-white rounded-[2rem] max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img src={selected.imagen_url} alt={selected.nombre} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelected(null)} 
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-100 cursor-pointer z-10 border"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono uppercase border border-white/30">{selected.categoria} • {selected.demo_tipo}</span>
                  <h3 className="text-2xl font-extrabold mt-2">{selected.nombre}</h3>
                  {selected.metrica && <p className="text-sm font-mono text-white/80 mt-1">{selected.metrica}</p>}
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{selected.descripcion}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.servicios.map((s: string, i: number) => (
                    <span key={i} className="text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-full text-[#ff2a2a] font-medium">{s}</span>
                  ))}
                </div>

                {(selected.instagram_url || selected.facebook_url || selected.website_url || selected.tiktok_url) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[11px] font-mono uppercase text-gray-500 mb-3">Redes del cliente</p>
                    <div className="flex gap-2">
                      {selected.instagram_url && (
                        <a href={selected.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-105 transition-transform">
                          <InstagramIcon className="w-5 h-5" />
                        </a>
                      )}
                      {selected.facebook_url && (
                        <a href={selected.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-105 transition-transform">
                          <FacebookIcon className="w-5 h-5" />
                        </a>
                      )}
                      {selected.website_url && (
                        <a href={selected.website_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:scale-105 transition-transform">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <a href={selected.demo_url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#ff2a2a] text-white font-semibold py-3.5 rounded-xl hover:bg-red-600 transition-colors text-xs uppercase tracking-wider">
                  {getDemoIcon(selected.demo_tipo)} {getDemoLabel(selected.demo_tipo)}
                </a>
                <p className="text-[11px] text-center text-gray-400 mt-3 font-mono">Click fuera o presiona ESC o la X para cerrar</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

