'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { LogOut, Upload, Trash2, Edit, Eye, EyeOff, Users, BookOpen, Briefcase, Image as ImageIcon, Video, FileUp, Sparkles, Plus, X } from 'lucide-react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'NetPro2024!';
const categoriasClientes = ['Medicina', 'Educación', 'Marcas Personales', 'Multinivel', 'Belleza', 'Eventos'];
const tiposServicio = ['Branding','Diseño Web','Meta Ads','Redes Sociales','Creación de Contenido'] as const;

export default function AdminUnificadoV6() {
  const [isAuth, setIsAuth] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'clientes' | 'cursos' | 'alumnos'>('clientes');

  const [clients, setClients] = useState<any[]>([]);
  const [serviceItems, setServiceItems] = useState<any[]>([]);
  const [clientForm, setClientForm] = useState<any>({ nombre: '', categoria: 'Medicina', descripcion: '', imagen_url: '', metrica: '', website_url: '', instagram_url: '', facebook_url: '', tiktok_url: '', youtube_url: '' });
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [uploadingClient, setUploadingClient] = useState(false);

  // Servicio demo form
  const [serviceForm, setServiceForm] = useState({ servicio_tipo: 'Branding' as any, imagen_url: '', demo_url: '', descripcion: '' });
  const [uploadingService, setUploadingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [courses, setCourses] = useState<any[]>([]);
  const [courseForm, setCourseForm] = useState({ titulo: '', slug: '', descripcion: '', miniatura_url: '', contenido: '', video_url: '' });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [uploadingCourse, setUploadingCourse] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [userForm, setUserForm] = useState({ nombre: '', empresa: '', usuario: '', password: '' });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => { if (localStorage.getItem('netpro_admin_auth')==='true') setIsAuth(true); }, []);
  useEffect(() => { if (isAuth) fetchAll(); }, [isAuth]);

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
    if (loginUser===ADMIN_USER && loginPass===ADMIN_PASS) { localStorage.setItem('netpro_admin_auth','true'); setIsAuth(true); }
    else setLoginError('Usuario o contraseña incorrectos');
  };

  const uploadToBucket = async (file: File, bucket: string) => {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g,'-')}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const slugify = (t:string)=>t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  // CLIENTE CRUD
  const saveClient = async () => {
    if (editingClientId) {
      await supabase.from('clients').update(clientForm).eq('id', editingClientId);
      setEditingClientId(null);
    } else {
      const { data } = await supabase.from('clients').insert(clientForm).select().single();
      if (data) setEditingClientId(data.id);
    }
    setClientForm({ nombre: '', categoria: 'Medicina', descripcion: '', imagen_url: '', metrica: '', website_url: '', instagram_url: '', facebook_url: '', tiktok_url: '', youtube_url: '' });
    fetchAll();
  };

  // SERVICIO ITEM CRUD
  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingService(true);
    try { const url = await uploadToBucket(file, 'client-images'); setServiceForm({...serviceForm, imagen_url: url}); } catch(err:any){ alert(err.message); }
    setUploadingService(false);
  };

  const saveServiceItem = async () => {
    if (!editingClientId) return alert('Primero crea y selecciona un cliente');
    if (!serviceForm.imagen_url) return alert('Sube una imagen demo del servicio');
    const payload = { client_id: editingClientId, ...serviceForm };
    if (editingServiceId) {
      await supabase.from('client_service_items').update(payload).eq('id', editingServiceId);
      setEditingServiceId(null);
    } else {
      await supabase.from('client_service_items').insert(payload);
    }
    setServiceForm({ servicio_tipo: 'Branding', imagen_url: '', demo_url: '', descripcion: '' });
    fetchAll();
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#fcf8f5] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl p-8 w-full max-w-sm">
          <h1 className="text-xl font-extrabold text-center">Admin NetPro V6</h1>
          <div className="space-y-3 mt-6">
            <input value={loginUser} onChange={e=>setLoginUser(e.target.value)} placeholder="admin" className="w-full border p-3 rounded-xl text-sm"/>
            <input type={showPass?'text':'password'} value={loginPass} onChange={e=>setLoginPass(e.target.value)} placeholder="pass" className="w-full border p-3 rounded-xl text-sm"/>
            {loginError && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{loginError}</div>}
            <button type="submit" className="w-full bg-[#ff2a2a] text-white py-3 rounded-full text-xs uppercase font-semibold">Entrar</button>
          </div>
        </form>
      </div>
    );
  }

  const itemsForSelected = serviceItems.filter(s=>s.client_id===editingClientId);

  return (
    <div className="min-h-screen bg-[#fcf8f5]">
      <div className="sticky top-0 z-30 flex justify-center px-4 pt-6">
        <div className="w-full max-w-7xl bg-white/80 backdrop-blur-2xl border border-white rounded-full px-6 py-3 flex justify-between items-center shadow">
          <a href="/" className="flex items-center gap-2 font-bold text-xs font-mono uppercase"><img src="/logo-netpro.png" className="h-7" alt="logo"/> NetPro Admin → Inicio</a>
          <div className="flex gap-2">
            <button onClick={()=>setActiveTab('clientes')} className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase font-semibold border ${activeTab==='clientes'?'bg-gray-900 text-white':'bg-white'}`}><Briefcase className="w-3.5 h-3.5 inline mr-1"/> Clientes</button>
            <button onClick={()=>setActiveTab('cursos')} className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase font-semibold border ${activeTab==='cursos'?'bg-gray-900 text-white':'bg-white'}`}>Cursos</button>
            <button onClick={()=>setActiveTab('alumnos')} className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase font-semibold border ${activeTab==='alumnos'?'bg-[#ff2a2a] text-white':'bg-white'}`}>Alumnos</button>
          </div>
          <button onClick={()=>{localStorage.removeItem('netpro_admin_auth'); setIsAuth(false);}} className="text-[11px] border px-3 py-1.5 rounded-full">Salir</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 pt-10">
        {activeTab==='clientes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow p-7 h-fit sticky top-28 space-y-6">
              <h2 className="font-bold text-sm uppercase tracking-widest">{editingClientId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <div className="space-y-3">
                <input value={clientForm.nombre} onChange={e=>setClientForm({...clientForm, nombre:e.target.value})} placeholder="Nombre cliente" className="w-full border p-3 rounded-xl text-sm"/>
                <div className="grid grid-cols-2 gap-2"><select value={clientForm.categoria} onChange={e=>setClientForm({...clientForm, categoria:e.target.value})} className="border p-3 rounded-xl text-sm">{categoriasClientes.map(c=><option key={c}>{c}</option>)}</select><input value={clientForm.metrica} onChange={e=>setClientForm({...clientForm, metrica:e.target.value})} placeholder="+180% Leads" className="border p-3 rounded-xl text-sm"/></div>
                <div><label className="text-[11px] font-mono uppercase">Foto principal 3:4 (desde PC)</label><input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; setUploadingClient(true); try{ const url=await uploadToBucket(f,'client-images'); setClientForm({...clientForm, imagen_url:url}); }catch(err:any){alert(err.message);} setUploadingClient(false); }} className="w-full text-xs mt-1"/><div className="text-xs">{uploadingClient?'Subiendo...':''}</div>{clientForm.imagen_url && <img src={clientForm.imagen_url} className="w-full aspect-[3/4] object-cover rounded-xl mt-2"/>}</div>
                <textarea value={clientForm.descripcion} onChange={e=>setClientForm({...clientForm, descripcion:e.target.value})} placeholder="Descripción corta" className="w-full border p-3 rounded-xl text-sm h-20"/>
                <div className="grid grid-cols-1 gap-2"><p className="text-[11px] font-mono uppercase text-gray-500">Redes - solo se activa icono si pegas URL</p><input value={clientForm.instagram_url} onChange={e=>setClientForm({...clientForm, instagram_url:e.target.value})} placeholder="Instagram URL" className="w-full border p-3 rounded-xl text-sm"/><input value={clientForm.facebook_url} onChange={e=>setClientForm({...clientForm, facebook_url:e.target.value})} placeholder="Facebook URL" className="w-full border p-3 rounded-xl text-sm"/><input value={clientForm.tiktok_url} onChange={e=>setClientForm({...clientForm, tiktok_url:e.target.value})} placeholder="TikTok URL" className="w-full border p-3 rounded-xl text-sm"/><input value={clientForm.youtube_url} onChange={e=>setClientForm({...clientForm, youtube_url:e.target.value})} placeholder="YouTube URL" className="w-full border p-3 rounded-xl text-sm"/><input value={clientForm.website_url} onChange={e=>setClientForm({...clientForm, website_url:e.target.value})} placeholder="Sitio Web URL" className="w-full border p-3 rounded-xl text-sm"/></div>
                <button onClick={saveClient} className="w-full bg-gray-900 text-white py-3 rounded-full text-xs uppercase font-semibold">{editingClientId?'Actualizar Cliente':'Crear Cliente'}</button>
                {editingClientId && <p className="text-[11px] font-mono text-green-600 text-center">Cliente seleccionado: ahora agrega servicios abajo</p>}
              </div>

              {/* SECCIÓN NUEVA - SERVICIOS CON IMAGEN */}
              {editingClientId && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#ff2a2a]"/> Servicios + Imagen Demo (varios)</h3>
                  <div className="mt-4 space-y-3 bg-[#fcf8f5] p-4 rounded-2xl border border-white">
                    <select value={serviceForm.servicio_tipo} onChange={e=>setServiceForm({...serviceForm, servicio_tipo:e.target.value as any})} className="w-full border p-3 rounded-xl text-sm bg-white">{tiposServicio.map(t=><option key={t}>{t}</option>)}</select>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 bg-white"><input type="file" accept="image/*" onChange={handleServiceImageUpload} className="w-full text-xs"/><div className="text-[11px] text-gray-500 mt-1">{uploadingService?'Subiendo imagen demo...':'Sube imagen del trabajo realizado para este servicio'}</div>{serviceForm.imagen_url && <img src={serviceForm.imagen_url} className="w-full aspect-[4/3] object-cover rounded-xl mt-2"/>}</div>
                    <input value={serviceForm.demo_url} onChange={e=>setServiceForm({...serviceForm, demo_url:e.target.value})} placeholder="Link demo (opcional) ej: sitio web" className="w-full border p-3 rounded-xl text-sm"/>
                    <input value={serviceForm.descripcion} onChange={e=>setServiceForm({...serviceForm, descripcion:e.target.value})} placeholder="Descripción corta del trabajo (opcional)" className="w-full border p-3 rounded-xl text-sm"/>
                    <button onClick={saveServiceItem} className="w-full bg-[#ff2a2a] text-white py-3 rounded-full text-xs uppercase font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> {editingServiceId?'Actualizar Servicio':'Agregar Servicio con Imagen'}</button>
                    {editingServiceId && <button onClick={()=>{setEditingServiceId(null); setServiceForm({ servicio_tipo:'Branding', imagen_url:'', demo_url:'', descripcion:''});}} className="w-full border bg-white py-2 rounded-full text-xs">Cancelar edición</button>}
                  </div>

                  <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                    {itemsForSelected.map((item:any)=>(
                      <div key={item.id} className="flex gap-2 items-center bg-white border rounded-xl p-2">
                        <img src={item.imagen_url} className="w-12 h-12 rounded-lg object-cover"/>
                        <div className="flex-1"><p className="text-xs font-bold">{item.servicio_tipo}</p><p className="text-[11px] text-gray-500 line-clamp-1">{item.descripcion}</p></div>
                        <button onClick={()=>{setServiceForm({ servicio_tipo:item.servicio_tipo, imagen_url:item.imagen_url, demo_url:item.demo_url||'', descripcion:item.descripcion||''}); setEditingServiceId(item.id);}} className="p-1.5 border rounded-full"><Edit className="w-3.5 h-3.5"/></button>
                        <button onClick={async()=>{ if(confirm('¿Eliminar demo?')){ await supabase.from('client_service_items').delete().eq('id',item.id); fetchAll(); }}} className="p-1.5 border border-red-100 text-red-600 rounded-full"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    ))}
                    {itemsForSelected.length===0 && <p className="text-[11px] text-gray-400 font-mono">Aún no has agregado servicios con imagen para este cliente. Agrega Branding, Web, etc. con su foto demo.</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clients.map((c:any)=>{
                const its = serviceItems.filter((s:any)=>s.client_id===c.id);
                return (
                  <div key={c.id} className="bg-white/80 rounded-[2rem] border border-white shadow overflow-hidden">
                    <img src={c.imagen_url} className="w-full aspect-[3/4] object-cover object-top"/>
                    <div className="p-4"><p className="font-bold text-sm">{c.nombre}</p><p className="text-xs text-gray-500">{c.categoria} • {its.length} demos</p><div className="flex gap-1 mt-2 flex-wrap">{its.map((it:any)=><span key={it.id} className="text-[9px] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full text-[#ff2a2a]">{it.servicio_tipo}</span>)}</div><div className="flex gap-2 mt-3"><button onClick={()=>{setClientForm({ nombre:c.nombre, categoria:c.categoria, descripcion:c.descripcion||'', imagen_url:c.imagen_url||'', metrica:c.metrica||'', website_url:c.website_url||'', instagram_url:c.instagram_url||'', facebook_url:c.facebook_url||'', tiktok_url:c.tiktok_url||'', youtube_url:c.youtube_url||''}); setEditingClientId(c.id); window.scrollTo({top:0, behavior:'smooth'});}} className="flex-1 border rounded-full py-1.5 text-[11px] font-mono uppercase">Editar + Servicios</button><button onClick={async()=>{if(confirm('¿Eliminar cliente y sus demos?')){await supabase.from('clients').delete().eq('id',c.id); fetchAll();}}} className="px-3 border border-red-100 text-red-600 rounded-full"><Trash2 className="w-3.5 h-3.5"/></button></div></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {activeTab==='cursos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow p-7 h-fit sticky top-28">
              <h2 className="font-bold text-sm uppercase tracking-widest">{editingCourseId ? 'Editar Curso' : 'Nuevo Curso'}</h2>
              <div className="space-y-3 mt-4">
                <input value={courseForm.titulo} onChange={e=>setCourseForm({...courseForm, titulo:e.target.value, slug:e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-')})} placeholder="Título curso" className="w-full border p-3 rounded-xl text-sm"/>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-3"><input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; setUploadingCourse(true); try{ const url=await uploadToBucket(f,'client-images'); setCourseForm({...courseForm, miniatura_url:url}); }catch{} setUploadingCourse(false); }} className="w-full text-xs"/><div className="text-xs">{uploadingCourse?'Subiendo...':''}</div>{courseForm.miniatura_url && <img src={courseForm.miniatura_url} className="w-full aspect-[16/10] object-cover rounded-xl mt-2"/>}</div>
                <div className="border-2 border-dashed border-red-100 bg-red-50/30 rounded-xl p-3"><input type="file" accept="video/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; setUploadingVideo(true); try{ const url=await uploadToBucket(f,'curso-videos'); setCourseForm({...courseForm, video_url:url}); }catch(err:any){ alert('Crea bucket curso-videos'); } setUploadingVideo(false); }} className="w-full text-xs"/><div className="text-xs">{uploadingVideo?'Subiendo video...':''}</div></div>
                <textarea value={courseForm.descripcion} onChange={e=>setCourseForm({...courseForm, descripcion:e.target.value})} placeholder="Descripción" className="w-full border p-3 rounded-xl text-sm h-20"/>
                <textarea value={courseForm.contenido} onChange={e=>setCourseForm({...courseForm, contenido:e.target.value})} placeholder="Contenido / temario" className="w-full border p-3 rounded-xl text-sm h-24"/>
                <button onClick={async()=>{
                  const slug = courseForm.slug || courseForm.titulo.toLowerCase().replace(/[^a-z0-9]+/g,'-');
                  const payload = {...courseForm, slug};
                  if(editingCourseId){ await supabase.from('portal_courses').update(payload).eq('id',editingCourseId); setEditingCourseId(null); }
                  else { await supabase.from('portal_courses').insert(payload); }
                  setCourseForm({ titulo:'', slug:'', descripcion:'', miniatura_url:'', contenido:'', video_url:'' }); fetchAll();
                }} className="w-full bg-[#ff2a2a] text-white py-3 rounded-full text-xs uppercase font-semibold">{editingCourseId?'Actualizar':'Crear Curso'}</button>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-3">
              {courses.map((c:any)=>(
                <div key={c.id} className="bg-white/80 rounded-2xl border p-4 flex gap-3">
                  <img src={c.miniatura_url} className="w-24 h-16 rounded-xl object-cover"/>
                  <div className="flex-1"><p className="font-bold text-sm">{c.titulo}</p><p className="text-xs text-gray-500">{c.slug}</p></div>
                  <button onClick={()=>{setCourseForm({ titulo:c.titulo, slug:c.slug, descripcion:c.descripcion||'', miniatura_url:c.miniatura_url||'', contenido:c.contenido||'', video_url:c.video_url||''}); setEditingCourseId(c.id);}} className="text-xs border px-3 py-1 rounded-full">Editar</button>
                  <button onClick={async()=>{ if(confirm('Eliminar?')){ await supabase.from('portal_courses').delete().eq('id',c.id); fetchAll(); }}} className="text-xs border border-red-100 text-red-600 px-3 py-1 rounded-full">Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab==='alumnos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white/80 rounded-[2rem] border border-white shadow p-7 h-fit sticky top-28">
              <h2 className="font-bold text-sm uppercase tracking-widest">{editingUserId?'Editar Alumno':'Nuevo Alumno'}</h2>
              <div className="space-y-3 mt-4">
                <input value={userForm.nombre} onChange={e=>setUserForm({...userForm, nombre:e.target.value})} placeholder="Nombre" className="w-full border p-3 rounded-xl text-sm"/>
                <input value={userForm.empresa} onChange={e=>setUserForm({...userForm, empresa:e.target.value})} placeholder="Empresa" className="w-full border p-3 rounded-xl text-sm"/>
                <div className="grid grid-cols-2 gap-2"><input value={userForm.usuario} onChange={e=>setUserForm({...userForm, usuario:e.target.value})} placeholder="usuario" className="border p-3 rounded-xl text-sm"/><input value={userForm.password} onChange={e=>setUserForm({...userForm, password:e.target.value})} placeholder="password" className="border p-3 rounded-xl text-sm"/></div>
                <div className="max-h-40 overflow-y-auto space-y-1">{courses.map((c:any)=><label key={c.id} className="flex gap-2 text-xs border p-2 rounded-xl"><input type="checkbox" checked={selectedCourses.includes(c.id)} onChange={e=>{ if(e.target.checked) setSelectedCourses([...selectedCourses,c.id]); else setSelectedCourses(selectedCourses.filter(id=>id!==c.id)); }}/>{c.titulo}</label>)}</div>
                <button onClick={async()=>{
                  if(!userForm.nombre || !userForm.usuario) return alert('Falta nombre/usuario');
                  if(editingUserId){ await supabase.from('portal_users').update(userForm).eq('id',editingUserId); await supabase.from('portal_enrollments').delete().eq('user_id',editingUserId); for(const cid of selectedCourses) await supabase.from('portal_enrollments').insert({user_id:editingUserId, course_id:cid}); setEditingUserId(null); }
                  else { const {data}=await supabase.from('portal_users').insert(userForm).select().single(); if(data){ for(const cid of selectedCourses) await supabase.from('portal_enrollments').insert({user_id:data.id, course_id:cid}); } }
                  setUserForm({ nombre:'', empresa:'', usuario:'', password:'' }); setSelectedCourses([]); fetchAll();
                }} className="w-full bg-[#ff2a2a] text-white py-3 rounded-full text-xs uppercase font-semibold">Guardar Alumno</button>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-2">
              {users.map((u:any)=>{
                const enrolls = enrollments.filter((en:any)=>en.user_id===u.id);
                const names = enrolls.map((en:any)=>courses.find((c:any)=>c.id===en.course_id)?.titulo).filter(Boolean);
                return <div key={u.id} className="bg-white border rounded-2xl p-4 flex justify-between"><div><p className="font-bold text-sm">{u.nombre}</p><p className="text-xs font-mono">@{u.usuario} • {u.password}</p><p className="text-[11px] mt-1">{names.join(', ')||'Sin cursos'}</p></div><div className="flex gap-1"><button onClick={async()=>{setUserForm({nombre:u.nombre, empresa:u.empresa||'', usuario:u.usuario, password:u.password}); setEditingUserId(u.id); const {data}=await supabase.from('portal_enrollments').select('course_id').eq('user_id',u.id); if(data) setSelectedCourses(data.map((d:any)=>d.course_id));}} className="text-xs border px-2 py-1 rounded-full">Editar</button><button onClick={async()=>{ if(confirm('Eliminar?')){ await supabase.from('portal_users').delete().eq('id',u.id); fetchAll(); }}} className="text-xs border border-red-100 text-red-600 px-2 py-1 rounded-full">Eliminar</button></div></div>
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}