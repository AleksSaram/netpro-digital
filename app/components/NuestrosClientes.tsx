'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, Client, CategoriaCliente } from '@/app/lib/supabase';
import { ArrowUpRight, X } from 'lucide-react';

const categorias: (CategoriaCliente | 'Todos')[] = ['Todos', 'Medicina', 'Educación', 'Marcas Personales', 'Multinivel', 'Belleza', 'Eventos'];

export default function NuestrosClientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeCat, setActiveCat] = useState<CategoriaCliente | 'Todos'>('Todos');
  const [selected, setSelected] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (!error && data) setClients(data as Client[]);
    setLoading(false);
  };

  const filtered = activeCat === 'Todos' ? clients : clients.filter(c => c.categoria === activeCat);

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
            Filtrados por tipo de industria. Cada tarjeta muestra qué hicimos y un demo real del trabajo.
          </p>
        </div>

        {/* Filtros por categoría */}
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

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[380px] bg-white/60 rounded-3xl animate-pulse border border-white" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((client) => (
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
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#ff2a2a] transition-colors">{client.nombre}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-2 line-clamp-2">{client.descripcion}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {client.servicios.slice(0,3).map((s, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-gray-100 border border-gray-200 px-2 py-1 rounded-full text-gray-700">
                        {s}
                      </span>
                    ))}
                    {client.servicios.length > 3 && (
                      <span className="text-[10px] font-mono bg-red-50 border border-red-100 px-2 py-1 rounded-full text-[#ff2a2a]">+{client.servicios.length - 3}</span>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-gray-500">{client.demo_tipo} • demo</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff2a2a]">Ver trabajo <ArrowUpRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-500 font-mono text-sm">No hay clientes en esta categoría aún.</div>
        )}
      </div>

      {/* Modal detalle */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="relative h-64">
                <img src={selected.imagen_url} alt={selected.nombre} className="w-full h-full object-cover" />
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:bg-white cursor-pointer"><X className="w-5 h-5" /></button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono uppercase border border-white/30">{selected.categoria}</span>
                  <h3 className="text-2xl font-extrabold mt-2">{selected.nombre}</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{selected.descripcion}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.servicios.map((s, i) => (
                    <span key={i} className="text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-full text-[#ff2a2a] font-medium">{s}</span>
                  ))}
                </div>
                <a href={selected.demo_url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#ff2a2a] text-white font-semibold py-3.5 rounded-xl hover:bg-red-600 transition-colors text-xs uppercase tracking-wider">
                  Ver demostración de {selected.demo_tipo} <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}