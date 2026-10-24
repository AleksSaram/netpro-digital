'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Trash2, Edit, Sparkles, Plus, Video, Image as ImageIcon, Users, BookOpen } from 'lucide-react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'NetPro2024!';
const categoriasClientes = ['Medicina', 'Educación', 'Marcas Personales', 'Multinivel', 'Belleza', 'Eventos'];
const tiposServicio = ['Branding', 'Diseño Web', 'Meta Ads', 'Redes Sociales', 'Creación de Contenido'] as const;

export default function AdminUnificadoV6() {
  const [isAuth, setIsAuth] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'clientes' | 'cursos' | 'alumnos'>('clientes');

  // ESTADOS CLIENTES
  const [clients, setClients] = useState<any[]>([]);
  const [serviceItems, setServiceItems] = useState<any[]>([]);
  const [clientForm, setClientForm] = useState<any>({ 
    nombre: '', 
    categoria: 'Medicina', 
    descripcion: '', 
    imagen_url: '', 
    metrica: '', 
    demo_tipo: 'Branding', 
    demo_url: 'https://netprodigital.com.mx', 
    website_url: '', 
    instagram_url: '', 
    facebook_url: '', 
    tiktok_url: '', 
    youtube_url: '' 
  });
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [uploadingClient, setUploadingClient] = useState(false);
  const [savingClient, setSavingClient] = useState(false);

  // SERVICIOS SERVICIO Y DEMOS
  const [serviceForm, setServiceForm] = useState({ servicio_tipo: 'Branding' as typeof tiposServicio[number], imagen_url: '', demo_url: '', descripcion: '' });
  const [uploadingService, setUploadingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [pendingServices, setPendingServices] = useState<any[]>([]);

  // CURSOS
  const [courses, setCourses] = useState<any[]>([]);
  const [courseForm, setCourseForm] = useState({ titulo: '', slug: '', descripcion: '', miniatura_url: '', contenido: '', video_url: '' });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [uploadingCourse, setUploadingCourse] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // ALUMNOS Y USUARIOS
  const [users, setUsers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [userForm, setUserForm] = useState({ nombre: '', empresa: '', usuario: '', password: '' });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => { 
    if (localStorage.getItem('netpro_admin_auth') === 'true') setIsAuth(true); 
  }, []);

  useEffect(() => { 
    if (isAuth) fetchAll(); 
  }, [isAuth]);

  const fetchAll = async () => {
    const { data: cl } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    const { data: si } = await supabase.from('client_service_items').select('*').order('created_at', { ascending: true });
    const { data: co } = await supabase.from('portal_courses').select('*').order('created_at', { ascending: false });
    const { data: us } = await supabase.from('portal_users').select('*').order('created_at', { ascending: false });
    const { data: en } = await supabase.from('portal_enrollments').select('*');
    if (cl) setClients(cl);
    if (si) setServiceItems(si);
    if (co) setCourses(co);
    if (us) setUsers(us);
    if (en) setEnrollments(en);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) { 
      localStorage.setItem('netpro_admin_auth', 'true'); 
      setIsAuth(true); 
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const uploadToBucket = async (file: File, bucket: string) => {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const saveClient = async () => {
    if (!clientForm.nombre.trim()) return alert('Por favor ingresa un nombre para el cliente');
    if (!clientForm.imagen_url) return alert('Sube la foto principal del cliente');
    
    setSavingClient(true);
    try {
      const payload = { 
        ...clientForm, 
        demo_tipo: clientForm.demo_tipo || 'Branding',
        demo_url: clientForm.demo_url || clientForm.website_url || 'https://netprodigital.com.mx'
      };
      
      if (editingClientId) {
        const { error } = await supabase.from('clients').update(payload).eq('id', editingClientId);
        if (error) throw error;
        alert('Cliente actualizado correctamente ✅');
      } else {
        const { data, error } = await supabase.from('clients').insert(payload).select().single();
        if (error) throw error;
        if (data) {
          if (pendingServices.length > 0) {
            const toInsert = pendingServices.map(s => ({ 
              client_id: data.id, 
              servicio_tipo: s.servicio_tipo, 
              imagen_url: s.imagen_url, 
              demo_url: s.demo_url, 
              descripcion: s.descripcion 
            }));
            const { error: errServ } = await supabase.from('client_service_items').insert(toInsert);
            if (errServ) throw errServ;
            setPendingServices([]);
          }
          setEditingClientId(data.id);
          alert(`Cliente "${data.nombre}" creado con éxito ✅`);
        }
      }
      fetchAll();
    } catch (err: any) {
      alert('Error guardando cliente: ' + (err.message || JSON.stringify(err)));
    }
    setSavingClient(false);
  };

  const resetClientForm = () => {
    setClientForm({ nombre: '', categoria: 'Medicina', descripcion: '', imagen_url: '', metrica: '', demo_tipo: 'Branding', demo_url: 'https://netprodigital.com.mx', website_url: '', instagram_url: '', facebook_url: '', tiktok_url: '', youtube_url: '' });
    setEditingClientId(null);
    setEditingServiceId(null);
    setPendingServices([]);
    setServiceForm({ servicio_tipo: 'Branding', imagen_url: '', demo_url: '', descripcion: '' });
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (!file) return;
    setUploadingService(true);
    try { 
      const url = await uploadToBucket(file, 'client-images'); 
      setServiceForm({ ...serviceForm, imagen_url: url }); 
    } catch (err: any) { 
      alert('Error subiendo al bucket: ' + err.message); 
    }
    setUploadingService(false);
  };

  const saveServiceItem = async () => {
    if (!serviceForm.imagen_url) return alert('Sube una imagen demo del servicio');
    
    if (editingClientId) {
      try {
        const payload = { client_id: editingClientId, ...serviceForm };
        if (editingServiceId) {
          const { error } = await supabase.from('client_service_items').update(payload).eq('id', editingServiceId);
          if (error) throw error;
          setEditingServiceId(null);
        } else {
          const { error } = await supabase.from('client_service_items').insert(payload);
          if (error) throw error;
        }
        setServiceForm({ servicio_tipo: 'Branding', imagen_url: '', demo_url: '', descripcion: '' });
        fetchAll();
        alert('Servicio agregado correctamente ✅');
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    } else {
      const tempId = `temp-${Date.now()}`;
      if (editingServiceId) {
        setPendingServices(pendingServices.map(s => s.id === editingServiceId ? { ...s, ...serviceForm } : s));
        setEditingServiceId(null);
      } else {
        setPendingServices([...pendingServices, { id: tempId, ...serviceForm }]);
      }
      setServiceForm({ servicio_tipo: 'Branding', imagen_url: '', demo_url: '', descripcion: '' });
    }
  };

  const saveUser = async () => {
    if (!userForm.nombre || !userForm.usuario || !userForm.password) {
      return alert('Completa los campos obligatorios: Nombre, Usuario y Contraseña.');
    }

    setSavingUser(true);
    try {
      let userId = editingUserId;

      if (editingUserId) {
        const { error } = await supabase.from('portal_users').update(userForm).eq('id', editingUserId);
        if (error) throw error;
        await supabase.from('portal_enrollments').delete().eq('user_id', editingUserId);
      } else {
        const { data, error } = await supabase.from('portal_users').insert(userForm).select().single();
        if (error) throw error;
        if (data) userId = data.id;
      }

      if (userId && selectedCourses.length > 0) {
        const enrollmentsToInsert = selectedCourses.map(courseId => ({
          user_id: userId,
          course_id: courseId
        }));
        const { error: errEnroll } = await supabase.from('portal_enrollments').insert(enrollmentsToInsert);
        if (errEnroll) throw errEnroll;
      }

      setUserForm({ nombre: '', empresa: '', usuario: '', password: '' });
      setSelectedCourses([]);
      setEditingUserId(null);
      fetchAll();
      alert('Alumno e inscripciones guardados con éxito ✅');
    } catch (err: any) {
      alert('Error guardando alumno: ' + err.message);
    }
    setSavingUser(false);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#fcf8f5] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-extrabold text-center text-gray-900">Admin NetPro V6</h1>
          <div className="space-y-3 mt-6">
            <input value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="Usuario" className="w-full border p-3 rounded-xl text-sm" />
            <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Contraseña" className="w-full border p-3 rounded-xl text-sm" />
            {loginError && <div className="text-xs text-red-600 bg-red-50 p-2 rounded text-center">{loginError}</div>}
            <button type="submit" className="w-full bg-[#ff2a2a] text-white py-3 rounded-full text-xs uppercase font-semibold">Entrar</button>
          </div>
        </form>
      </div>
    );
  }

  const itemsForSelected = editingClientId ? serviceItems.filter(s => s.client_id === editingClientId) : [];
  const allVisibleServices = editingClientId ? itemsForSelected : pendingServices;

  return (
    <div className="min-h-screen bg-[#fcf8f5]">
      
      {/* NAVBAR SUPERIOR COMPACTO */}
      <div className="sticky top-0 z-30 flex justify-center px-4 pt-4">
        <div className="w-full max-w-7xl bg-white/80 backdrop-blur-2xl border border-white rounded-full px-6 py-2.5 flex justify-between items-center shadow-xs">
          <a href="/" className="flex items-center gap-2 font-bold text-xs font-mono uppercase text-gray-900">
            NetPro Admin
          </a>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('clientes')} className={`px-4 py-1.5 rounded-full text-[11px] font-mono uppercase font-semibold border transition-all ${activeTab === 'clientes' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
              Clientes
            </button>
            <button onClick={() => setActiveTab('cursos')} className={`px-4 py-1.5 rounded-full text-[11px] font-mono uppercase font-semibold border transition-all ${activeTab === 'cursos' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
              Cursos
            </button>
            <button onClick={() => setActiveTab('alumnos')} className={`px-4 py-1.5 rounded-full text-[11px] font-mono uppercase font-semibold border transition-all ${activeTab === 'alumnos' ? 'bg-[#ff2a2a] text-white border-[#ff2a2a]' : 'bg-white text-gray-700'}`}>
              Alumnos
            </button>
          </div>
          <button onClick={() => { localStorage.removeItem('netpro_admin_auth'); setIsAuth(false); }} className="text-[11px] border px-3 py-1 rounded-full text-gray-600 hover:bg-gray-50">
            Salir
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 pt-6">

        {/* ================= TAB CLIENTES COMPACTO ================= */}
        {activeTab === 'clientes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMNA IZQUIERDA: FORMULARIO */}
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-xs p-5 lg:sticky lg:top-20 space-y-4 max-h-[88vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="font-bold text-xs uppercase tracking-widest text-gray-900">{editingClientId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                {editingClientId && <button onClick={resetClientForm} className="text-[10px] border px-2.5 py-1 rounded-full bg-white text-gray-700 hover:bg-gray-50">+ Nuevo</button>}
              </div>

              <div className="space-y-2.5">
                <input value={clientForm.nombre} onChange={e => setClientForm({ ...clientForm, nombre: e.target.value })} placeholder="Nombre cliente *" className="w-full border p-2.5 rounded-xl text-xs" />
                <div className="grid grid-cols-3 gap-1.5">
                  <select value={clientForm.categoria} onChange={e => setClientForm({ ...clientForm, categoria: e.target.value })} className="border p-2 rounded-xl text-xs bg-white">{categoriasClientes.map(c => <option key={c}>{c}</option>)}</select>
                  <input value={clientForm.metrica} onChange={e => setClientForm({ ...clientForm, metrica: e.target.value })} placeholder="+180% Leads" className="border p-2 rounded-xl text-xs" />
                  <select value={clientForm.demo_tipo} onChange={e => setClientForm({ ...clientForm, demo_tipo: e.target.value })} className="border p-2 rounded-xl text-xs bg-red-50">{tiposServicio.map(t => <option key={t}>{t}</option>)}</select>
                </div>
                
                {/* SUBIDA DE FOTO Y PREVISUALIZACIÓN REDUCIDA */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1">Foto principal 3:4 *</label>
                  <input type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; setUploadingClient(true); try { const url = await uploadToBucket(f, 'client-images'); setClientForm({ ...clientForm, imagen_url: url }); } catch (err: any) { alert('Error: ' + err.message); } setUploadingClient(false); }} className="w-full text-xs" />
                  {uploadingClient && <div className="text-xs text-[#ff2a2a] mt-1">Subiendo...</div>}
                  {clientForm.imagen_url && (
                    <div className="mt-2 flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <img src={clientForm.imagen_url} alt="Vista previa" className="w-14 h-14 object-cover object-top rounded-lg border" />
                      <span className="text-[10px] font-mono text-gray-500">Imagen asignada</span>
                    </div>
                  )}
                </div>

                <textarea value={clientForm.descripcion} onChange={e => setClientForm({ ...clientForm, descripcion: e.target.value })} placeholder="Descripción corta" className="w-full border p-2.5 rounded-xl text-xs h-16 resize-none" />
                
                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono uppercase text-gray-400">Redes sociales (URLs)</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input value={clientForm.instagram_url} onChange={e => setClientForm({ ...clientForm, instagram_url: e.target.value })} placeholder="Instagram" className="w-full border p-2 rounded-lg text-xs" />
                    <input value={clientForm.facebook_url} onChange={e => setClientForm({ ...clientForm, facebook_url: e.target.value })} placeholder="Facebook" className="w-full border p-2 rounded-lg text-xs" />
                    <input value={clientForm.tiktok_url} onChange={e => setClientForm({ ...clientForm, tiktok_url: e.target.value })} placeholder="TikTok" className="w-full border p-2 rounded-lg text-xs" />
                    <input value={clientForm.youtube_url} onChange={e => setClientForm({ ...clientForm, youtube_url: e.target.value })} placeholder="YouTube" className="w-full border p-2 rounded-lg text-xs" />
                  </div>
                  <input value={clientForm.website_url} onChange={e => setClientForm({ ...clientForm, website_url: e.target.value })} placeholder="Sitio Web URL" className="w-full border p-2 rounded-lg text-xs mt-1" />
                </div>
              </div>

              {/* MÓDULO DE SERVICIOS ADICIONALES */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-gray-900 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff2a2a]" /> Demos por Servicio
                </h3>
                <div className="space-y-2 p-3 rounded-xl border bg-[#fcf8f5] border-gray-100">
                  <select value={serviceForm.servicio_tipo} onChange={e => setServiceForm({ ...serviceForm, servicio_tipo: e.target.value as any })} className="w-full border p-2 rounded-lg text-xs bg-white">{tiposServicio.map(t => <option key={t}>{t}</option>)}</select>
                  <input type="file" accept="image/*" onChange={handleServiceImageUpload} className="w-full text-xs" />
                  {uploadingService && <div className="text-[10px] text-gray-500">Subiendo demo...</div>}
                  {serviceForm.imagen_url && <img src={serviceForm.imagen_url} alt="Demo" className="w-full h-20 object-cover rounded-lg" />}
                  <input value={serviceForm.descripcion} onChange={e => setServiceForm({ ...serviceForm, descripcion: e.target.value })} placeholder="Descripción del trabajo" className="w-full border p-2 rounded-lg text-xs" />
                  <button onClick={saveServiceItem} disabled={uploadingService} className="w-full bg-[#ff2a2a] text-white py-2 rounded-lg text-xs uppercase font-semibold flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Agregar Servicio
                  </button>
                </div>

                <div className="mt-3 space-y-1.5 max-h-40 overflow-y-auto">
                  {allVisibleServices.map((item: any) => (
                    <div key={item.id} className="flex gap-2 items-center bg-white border rounded-lg p-1.5">
                      <img src={item.imagen_url} alt="item" className="w-8 h-8 rounded-md object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold leading-tight">{item.servicio_tipo}</p>
                      </div>
                      <button onClick={async () => {
                        if (String(item.id).startsWith('temp-')) {
                          setPendingServices(pendingServices.filter(s => s.id !== item.id));
                        } else {
                          if (confirm('¿Eliminar demo?')) { await supabase.from('client_service_items').delete().eq('id', item.id); fetchAll(); }
                        }
                      }} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={saveClient} disabled={savingClient || uploadingClient} className="w-full bg-gray-900 text-white py-3 rounded-xl text-xs uppercase font-semibold disabled:opacity-50">
                {savingClient ? 'Guardando...' : editingClientId ? 'Actualizar Cliente' : 'Crear Cliente'}
              </button>
            </div>

            {/* COLUMNA DERECHA: REJILLA DE TARJETAS COMPACTAS (4 COLUMNAS) */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {clients.map((c: any) => {
                const its = serviceItems.filter((s: any) => s.client_id === c.id);
                return (
                  <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors">
                    <div>
                      {/* CONTENEDOR COMPACTO DE IMAGEN (MAX ALTURA) */}
                      <div className="relative w-full h-32 bg-gray-100 overflow-hidden">
                        <img src={c.imagen_url} alt={c.nombre} className="w-full h-full object-cover object-top" />
                        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-[#ff2a2a]">
                          {c.categoria}
                        </span>
                      </div>
                      
                      <div className="p-3">
                        <p className="font-bold text-xs text-gray-900 truncate">{c.nombre}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{its.length} demos</p>
                      </div>
                    </div>

                    <div className="p-2 pt-0 flex gap-1.5 border-t border-gray-50 mt-1">
                      <button onClick={() => { setClientForm({ nombre: c.nombre, categoria: c.categoria, descripcion: c.descripcion || '', imagen_url: c.imagen_url || '', metrica: c.metrica || '', demo_tipo: c.demo_tipo || 'Branding', demo_url: c.demo_url || c.website_url || 'https://netprodigital.com.mx', website_url: c.website_url || '', instagram_url: c.instagram_url || '', facebook_url: c.facebook_url || '', tiktok_url: c.tiktok_url || '', youtube_url: c.youtube_url || '' }); setEditingClientId(c.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-1 border rounded-lg py-1 text-[10px] font-mono uppercase bg-white hover:bg-gray-50 text-gray-800">Editar</button>
                      <button onClick={async () => { if (confirm('¿Eliminar cliente?')) { await supabase.from('clients').delete().eq('id', c.id); fetchAll(); } }} className="px-2 border border-red-100 text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ================= TAB CURSOS COMPACTO ================= */}
        {activeTab === 'cursos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-xs p-5 lg:sticky lg:top-20 space-y-3">
              <h2 className="font-bold text-xs uppercase tracking-widest text-gray-900">{editingCourseId ? 'Editar Curso' : 'Nuevo Curso'}</h2>
              <div className="space-y-2.5 mt-3">
                <input 
                  value={courseForm.titulo} 
                  onChange={e => {
                    const titulo = e.target.value;
                    const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    let video_url = courseForm.video_url;
                    if (titulo.toLowerCase().includes('redes') || titulo.toLowerCase().includes('taller')) {
                      if (!video_url) video_url = '/Complementariorich.mp4';
                    }
                    setCourseForm({ ...courseForm, titulo, slug, video_url });
                  }} 
                  placeholder="Título curso ej: Taller de Redes Sociales" 
                  className="w-full border p-2.5 rounded-xl text-xs" 
                />

                <div className="border border-dashed border-gray-200 rounded-xl p-2.5 bg-white">
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1">Miniatura curso</label>
                  <input type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; setUploadingCourse(true); try { const url = await uploadToBucket(f, 'client-images'); setCourseForm({ ...courseForm, miniatura_url: url }); } catch {} setUploadingCourse(false); }} className="w-full text-xs" />
                  {courseForm.miniatura_url && <img src={courseForm.miniatura_url} alt="Miniatura" className="w-full h-20 object-cover rounded-lg mt-2" />}
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1">Video del Curso</label>
                  <button 
                    type="button" 
                    onClick={() => setCourseForm({ ...courseForm, video_url: '/Complementariorich.mp4' })} 
                    className={`w-full border p-2 rounded-lg text-[10px] font-mono uppercase flex items-center justify-center gap-1.5 transition-colors mb-1.5 ${courseForm.video_url === '/Complementariorich.mp4' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
                  >
                    <Video className="w-3.5 h-3.5 text-[#ff2a2a]" /> Usar Complementariorich.mp4
                  </button>

                  <input value={courseForm.video_url} onChange={e => setCourseForm({ ...courseForm, video_url: e.target.value })} placeholder="/Complementariorich.mp4 o URL" className="w-full border p-2 rounded-lg text-xs" />
                </div>

                <textarea value={courseForm.descripcion} onChange={e => setCourseForm({ ...courseForm, descripcion: e.target.value })} placeholder="Descripción" className="w-full border p-2.5 rounded-xl text-xs h-16 resize-none" />

                <button onClick={async () => {
                  const slug = courseForm.slug || courseForm.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  const payload = { ...courseForm, slug };
                  try {
                    if (editingCourseId) { 
                      const { error } = await supabase.from('portal_courses').update(payload).eq('id', editingCourseId); 
                      if (error) throw error; 
                      setEditingCourseId(null); 
                    } else { 
                      const { error } = await supabase.from('portal_courses').insert(payload); 
                      if (error) throw error; 
                    }
                    setCourseForm({ titulo: '', slug: '', descripcion: '', miniatura_url: '', contenido: '', video_url: '' }); 
                    fetchAll(); 
                    alert('Curso guardado correctamente ✅');
                  } catch (err: any) { alert('Error: ' + err.message); }
                }} className="w-full bg-[#ff2a2a] text-white py-2.5 rounded-xl text-xs uppercase font-semibold">
                  {editingCourseId ? 'Actualizar Curso' : 'Crear Curso'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-2.5">
              {courses.map((c: any) => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-3 flex gap-3 items-center">
                  <img src={c.miniatura_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'} alt={c.titulo} className="w-16 h-12 rounded-lg object-cover bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">{c.titulo}</p>
                    <p className="text-[10px] text-blue-600 truncate font-mono">{c.video_url || 'Sin video'}</p>
                  </div>
                  <button onClick={() => { setCourseForm({ titulo: c.titulo, slug: c.slug, descripcion: c.descripcion || '', miniatura_url: c.miniatura_url || '', contenido: c.contenido || '', video_url: c.video_url || '' }); setEditingCourseId(c.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[10px] border px-2.5 py-1 rounded-lg bg-white hover:bg-gray-50 font-mono">Editar</button>
                  <button onClick={async () => { if (confirm('¿Eliminar curso?')) { await supabase.from('portal_courses').delete().eq('id', c.id); fetchAll(); } }} className="text-[10px] border border-red-100 text-red-600 px-2 py-1 rounded-lg hover:bg-red-50"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB ALUMNOS COMPACTO ================= */}
        {activeTab === 'alumnos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-xs p-5 lg:sticky lg:top-20 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-xs uppercase tracking-widest text-gray-900">{editingUserId ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
                {editingUserId && (
                  <button onClick={() => { setEditingUserId(null); setUserForm({ nombre: '', empresa: '', usuario: '', password: '' }); setSelectedCourses([]); }} className="text-[10px] border px-2 py-0.5 rounded-full bg-white">
                    + Nuevo
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                <input value={userForm.nombre} onChange={e => setUserForm({ ...userForm, nombre: e.target.value })} placeholder="Nombre completo *" className="w-full border p-2.5 rounded-xl text-xs" />
                <input value={userForm.empresa} onChange={e => setUserForm({ ...userForm, empresa: e.target.value })} placeholder="Empresa / Marca" className="w-full border p-2.5 rounded-xl text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={userForm.usuario} onChange={e => setUserForm({ ...userForm, usuario: e.target.value })} placeholder="Usuario *" className="border p-2 rounded-xl text-xs" />
                  <input value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} placeholder="Contraseña *" className="border p-2 rounded-xl text-xs font-mono" />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1.5">Asignar Cursos</label>
                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {courses.map((c: any) => (
                      <label key={c.id} className={`flex items-center gap-2 text-xs border p-2 rounded-lg cursor-pointer ${selectedCourses.includes(c.id) ? 'bg-red-50 border-red-200 text-[#ff2a2a] font-semibold' : 'bg-white'}`}>
                        <input 
                          type="checkbox" 
                          checked={selectedCourses.includes(c.id)} 
                          onChange={e => {
                            if (e.target.checked) setSelectedCourses([...selectedCourses, c.id]);
                            else setSelectedCourses(selectedCourses.filter(id => id !== c.id));
                          }} 
                          className="accent-[#ff2a2a]"
                        />
                        <span className="truncate">{c.titulo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={saveUser} disabled={savingUser} className="w-full bg-[#ff2a2a] text-white py-2.5 rounded-xl text-xs uppercase font-semibold disabled:opacity-50 mt-2">
                  {savingUser ? 'Guardando...' : editingUserId ? 'Actualizar Alumno' : 'Guardar Alumno'}
                </button>
              </div>
            </div>

            {/* LISTA DE ALUMNOS */}
            <div className="lg:col-span-8 space-y-2">
              {users.map((u: any) => {
                const enrolls = enrollments.filter((en: any) => en.user_id === u.id);
                const courseNames = enrolls.map((en: any) => courses.find((c: any) => c.id === en.course_id)?.titulo).filter(Boolean);

                return (
                  <div key={u.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-gray-900">{u.nombre} {u.empresa ? `(${u.empresa})` : ''}</p>
                      <div className="flex gap-2 text-[10px] font-mono text-gray-500 mt-0.5">
                        <span>User: <strong className="text-gray-800">@{u.usuario}</strong></span>
                        <span>Pass: <strong className="text-gray-800">{u.password}</strong></span>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button 
                        onClick={async () => {
                          setUserForm({ nombre: u.nombre, empresa: u.empresa || '', usuario: u.usuario, password: u.password });
                          setEditingUserId(u.id);
                          const { data } = await supabase.from('portal_enrollments').select('course_id').eq('user_id', u.id);
                          if (data) setSelectedCourses(data.map((d: any) => d.course_id));
                        }} 
                        className="text-[10px] border px-2.5 py-1 rounded-lg bg-white hover:bg-gray-50 font-mono"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm('¿Eliminar alumno?')) {
                            await supabase.from('portal_users').delete().eq('id', u.id);
                            fetchAll();
                          }
                        }} 
                        className="text-[10px] border border-red-100 text-red-600 px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}