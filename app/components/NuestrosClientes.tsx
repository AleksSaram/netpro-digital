'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { ArrowUpRight, X, Globe, ExternalLink, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

type Categoria = 'Todos' | 'Medicina' | 'Educación' | 'Marcas Personales' | 'Multinivel' | 'Belleza' | 'Eventos';
const categorias: Categoria[] = ['Todos', 'Medicina', 'Educación', 'Marcas Personales', 'Multinivel', 'Belleza', 'Eventos'];
const tiposServicio = ['Branding','Diseño Web','Meta Ads','Redes Sociales','Creación de Contenido'] as const;

type ServiceItem = {
  id: string;
  client_id: string;
  servicio_tipo: typeof tiposServicio[number];
  imagen_url: string;
  demo_url?: string;
  descripcion?: string;
};

const Icon = {
  Facebook: (p:any) => (<svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>),
  Instagram: (p:any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>),
  TikTok: (p:any) => (<svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-1.77V18a4.5 4.5 0 11-4.5-4.5c.26 0 .51.02.75.06V9.8a8.5 8.5 0 00-.75-.05A8.5 8.5 0 108.5 18V6.69a8.5 8.5 0 0011.09 0z"/></svg>),
  Youtube: (p:any) => (<svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 12.2c0-3.1-.2-5.4-.5-6.1-.3-.7-.7-1.2-1.4-1.5-.7-.3-3-.5-6.1-.5h-7c-3.1 0-5.4.2-6.1.5-.7.3-1.2.8-1.5 1.5-.3.7-.5 3-.5 6.1s.2 5.4.5 6.1c.3.7.8 1.2 1.5 1.5.7.3 3 .5 6.1.5h7c3.1 0 5.4-.2 6.1-.5.7-.3 1.1-.8 1.4-1.5.3-.7.5-3 .5-6.1zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>),
};

export default function NuestrosClientes() {
  const [clients, setClients] = useState<any[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [activeCat, setActiveCat] = useState<Categoria>('Todos');
  const [selected, setSelected] = useState<any | null>(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<ServiceItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => {
    setLoading(true);
    const { data: cl } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    const { data: items } = await supabase.from('client_service_items').select('*').order('created_at', { ascending: true });
    if (cl) setClients(cl);
    if (items) setServiceItems(items as any);
    setLoading(false);
  };

  const getItemsForClient = (clientId: string) => serviceItems.filter(i => i.client_id === clientId);
  const filtered = activeCat === 'Todos' ? clients : clients.filter((c:any)=>c.categoria===activeCat);
  
  const handleOpen = (client:any) => {
    setSelected(client);
    const items = getItemsForClient(client.id);
    setActiveService(items.length > 0 ? items[0].servicio_tipo : null);
    requestAnimationFrame(() => requestAnimationFrame(() => setMobileOpen(true)));
  };

  const handleCloseMobile = () => {
    // FIX SAFARI: No borramos las imágenes, solo deslizamos el sheet abajo
    // Antes hacíamos setSelected(null) y Safari tenía que liberar 3 imágenes de 2-3MB de golpe = 5-7s freeze
    setMobileOpen(false);
    // No hacemos setSelected(null) en móvil, lo dejamos en memoria oculto
  };

  const handleCloseDesktop = () => {
    setSelected(null);
    setMobileOpen(false);
  };

  const filteredForActive = selected ? getItemsForClient(selected.id).filter((i:ServiceItem)=>!activeService || i.servicio_tipo===activeService) : [];
  const openLightbox = (item: ServiceItem) => {
    const idx = filteredForActive.findIndex((i:ServiceItem)=>i.id===item.id);
    setLightboxIndex(idx >=0 ? idx : 0);
    setLightbox(item);
  };

  return (
    <>
      <section id="clientes" className="py-28 px-6 relative z-10 border-t border-white/40 bg-white/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-mono tracking-widest uppercase text-[#ff2a2a] bg-red-50/80 px-3 py-1 rounded-full border border-red-100 font-semibold">02 // Nuestros Clientes</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-4 text-gray-900">Clientes Reales</h2>
            </div>
            <p className="text-gray-600 max-w-md text-sm leading-relaxed">Cada servicio con demo visual completa.</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {categorias.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border ${activeCat===cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white/60 border-white/80 hover:bg-white'}`}>{cat}</button>
            ))}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="aspect-[3/4] bg-white/60 rounded-3xl animate-pulse"/> )}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((client:any) => {
                const items = getItemsForClient(client.id);
                const tipos = [...new Set(items.map(i=>i.servicio_tipo))];
                return (
                  <div key={client.id} className="group bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all cursor-pointer flex flex-col" onClick={()=>handleOpen(client)}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img src={client.imagen_url} alt={client.nombre} loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"/>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-white text-[10px] font-mono font-bold text-[#ff2a2a] uppercase">{client.categoria}</div>
                      {client.metrica && <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-lg text-[11px] font-mono text-white">{client.metrica}</div>}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#ff2a2a]">{client.nombre}</h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{client.descripcion}</p>
                      <div className="flex flex-wrap gap-1.5 mt-4">{tipos.map((t:string)=><span key={t} className="text-[10px] font-mono bg-red-50 border border-red-100 px-2.5 py-1 rounded-full text-[#ff2a2a] font-medium">{t}</span>)}</div>
                      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-[11px] font-mono uppercase text-gray-500"><span>{items.length} demos</span><span className="text-[#ff2a2a] flex items-center gap-1 font-semibold">Ver <ArrowUpRight className="w-3.5 h-3.5"/></span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* WEB */}
      <div className="hidden md:block">
        {selected && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md overflow-y-auto p-6 flex items-center justify-center">
            <div className="bg-white rounded-[2rem] max-w-6xl w-full overflow-hidden shadow-2xl flex flex-row max-h-[88vh] my-8">
              <div className="w-[36%] bg-[#fcf8f5] p-7 flex flex-col overflow-y-auto border-r border-white">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5">
                  <img src={selected.imagen_url} className="w-full h-full object-cover object-top"/>
                  <button onClick={handleCloseDesktop} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center"><X className="w-4 h-4"/></button>
                </div>
                <h3 className="text-2xl font-extrabold">{selected.nombre}</h3>
                <p className="text-xs font-mono uppercase text-[#ff2a2a] mt-1">{selected.categoria} • {selected.metrica}</p>
                <p className="text-sm text-gray-600 mt-4">{selected.descripcion}</p>
                <div className="mt-6 flex gap-2 flex-wrap">
                  {selected.instagram_url && <a href={selected.instagram_url} target="_blank" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white"><Icon.Instagram className="w-5 h-5"/></a>}
                  {selected.facebook_url && <a href={selected.facebook_url} target="_blank" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white"><Icon.Facebook className="w-5 h-5"/></a>}
                  {selected.tiktok_url && <a href={selected.tiktok_url} target="_blank" className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white"><Icon.TikTok className="w-5 h-5"/></a>}
                  {selected.youtube_url && <a href={selected.youtube_url} target="_blank" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white"><Icon.Youtube className="w-5 h-5"/></a>}
                  {selected.website_url && <a href={selected.website_url} target="_blank" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white"><Globe className="w-5 h-5"/></a>}
                </div>
                <button onClick={handleCloseDesktop} className="mt-auto w-full border border-gray-200 bg-white rounded-full py-3 text-xs font-mono uppercase flex justify-center gap-2"><X className="w-4 h-4"/> Cerrar</button>
              </div>
              <div className="w-[64%] p-7 overflow-y-auto bg-white">
                <div className="flex justify-between items-center mb-5"><h4 className="font-bold text-sm uppercase tracking-widest">Portafolio por servicio</h4><span className="text-[11px] font-mono bg-gray-900 text-white px-3 py-1 rounded-full">{getItemsForClient(selected.id).length} trabajos</span></div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[...new Set(getItemsForClient(selected.id).map((i:ServiceItem)=>i.servicio_tipo))].map((tipo:string)=>(
                    <button key={tipo} onClick={()=>setActiveService(tipo)} className={`px-4 py-2 rounded-full text-xs font-mono uppercase border ${activeService===tipo ? 'bg-[#ff2a2a] text-white border-[#ff2a2a]' : 'bg-white border-gray-200'}`}>{tipo}</button>
                  ))}
                </div>
                <div className="space-y-6">
                  {filteredForActive.map((item:ServiceItem)=>(
                    <div key={item.id} className="rounded-[1.5rem] overflow-hidden border border-gray-100 bg-[#fcf8f5] cursor-zoom-in" onClick={()=>openLightbox(item)}>
                      <div className="relative bg-white p-2"><img src={item.imagen_url} alt={item.servicio_tipo} loading="lazy" className="w-full h-auto max-h-[600px] object-contain rounded-xl bg-white"/></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MÓVIL - FIX SAFARI NO GC */}
      <div className="block md:hidden">
        {selected && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${mobileOpen ? 'bg-black/80 opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={handleCloseMobile}/>
            <div className={`relative bg-white w-full rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[92dvh] transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}`}>
              <div className="w-full flex justify-center pt-3 pb-2 shrink-0"><div className="w-10 h-1.5 bg-gray-300 rounded-full"/></div>
              <div className="bg-[#fcf8f5] px-4 pb-4 flex flex-col shrink-0">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-gray-100"><img src={selected.imagen_url} className="w-full h-full object-cover object-top" loading="eager"/></div>
                  <div className="flex-1 min-w-0"><h3 className="text-[17px] font-extrabold leading-tight">{selected.nombre}</h3><p className="text-[11px] font-mono uppercase text-[#ff2a2a] mt-1 truncate">{selected.categoria} • {selected.metrica}</p><p className="text-[13px] text-gray-600 mt-1.5 line-clamp-2">{selected.descripcion}</p></div>
                  <button onClick={handleCloseMobile} className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center shrink-0 self-start"><X className="w-4 h-4"/></button>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {selected.instagram_url && <a href={selected.instagram_url} target="_blank" className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white"><Icon.Instagram className="w-4 h-4"/></a>}
                  {selected.facebook_url && <a href={selected.facebook_url} target="_blank" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><Icon.Facebook className="w-4 h-4"/></a>}
                  {selected.tiktok_url && <a href={selected.tiktok_url} target="_blank" className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white"><Icon.TikTok className="w-4 h-4"/></a>}
                  {selected.youtube_url && <a href={selected.youtube_url} target="_blank" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white"><Icon.Youtube className="w-4 h-4"/></a>}
                  {selected.website_url && <a href={selected.website_url} target="_blank" className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white"><Globe className="w-4 h-4"/></a>}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 bg-white" style={{ WebkitOverflowScrolling: 'touch' } as any}>
                <div className="flex justify-between items-center mb-4"><h4 className="font-bold text-[13px] uppercase tracking-widest">Portafolio por servicio</h4><span className="text-[11px] font-mono bg-gray-900 text-white px-3 py-1 rounded-full">{getItemsForClient(selected.id).length}</span></div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {[...new Set(getItemsForClient(selected.id).map((i:ServiceItem)=>i.servicio_tipo))].map((tipo:string)=>(
                    <button key={tipo} onClick={()=>setActiveService(tipo)} className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase border ${activeService===tipo ? 'bg-[#ff2a2a] text-white border-[#ff2a2a]' : 'bg-white border-gray-200'}`}>{tipo}</button>
                  ))}
                </div>
                <div className="space-y-4 pb-28">
                  {filteredForActive.map((item:ServiceItem)=>(
                    <div key={item.id} className="rounded-[1.25rem] overflow-hidden border border-gray-100 bg-[#fcf8f5]" onClick={()=>openLightbox(item)}>
                      <div className="relative bg-white p-1.5"><div className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase shadow-sm">{item.servicio_tipo}</div><img src={item.imagen_url} alt={item.servicio_tipo} loading="lazy" className="w-full h-auto object-contain rounded-xl bg-white" style={{ maxHeight: '65vh' }}/></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-white/0 pt-8">
                <button onClick={handleCloseMobile} className="w-full bg-gray-900 text-white rounded-full py-4 text-xs font-mono uppercase flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98] transition-transform"><X className="w-4 h-4"/> Cerrar</button>
                <div className="h-[env(safe-area-inset-bottom)]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={()=>setLightbox(null)}>
          <button onClick={()=>setLightbox(null)} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center"><X className="w-5 h-5"/></button>
          <img src={lightbox.imagen_url} alt={lightbox.servicio_tipo} className="max-w-full max-h-[85vh] object-contain rounded-2xl bg-white" onClick={e=>e.stopPropagation()}/>
        </div>
      )}
    </>
  );
}

