'use client';

import { useState, useEffect } from 'react';
import { supabase, Client, CategoriaCliente } from '@/app/lib/supabase';
import { LogOut, Upload, Trash2, Edit, X, Eye, EyeOff, Users, BookOpen, Briefcase } from 'lucide-react';

// ========= CONFIG ADMIN LOGIN =========
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'NetPro2024!'; // <-- CAMBIA AQUÍ TU CONTRASEÑA
// =====================================

const categoriasClientes: CategoriaCliente[] = ['Medicina', 'Educación', 'Marcas Personales', 'Multinivel', 'Belleza', 'Eventos'];
const demoTipos = ['web', 'video', 'feed', 'branding'];

export default function AdminUnificado() {
  // Auth
  const [isAuth, setIsAuth] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'clientes' | 'cursos' | 'alumnos'>('clientes');

  // ----- CLIENTES STATE -----
  const [clients, setClients] = useState<any[]>([]);
  const [clientForm, setClientForm] = useState<any>({ nombre: '', categoria: 'Medicina', descripcion: '', imagen_url: '', servicios: '', metrica: '', demo_tipo: 'web', demo_url: '', website_url: '', instagram_url: '', facebook_url: '' });
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [uploadingClient, setUploadingClient] = useState(false);

  // ----- CURSOS STATE -----
  const [courses, setCourses] = useState<any[]>([]);
  const [courseForm, setCourseForm] = useState({ titulo: '', slug: '', descripcion: '', miniatura_url: '', contenido: '' });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [uploadingCourse, setUploadingCourse] = useState(false);

  // ----- ALUMNOS STATE -----
  const [users, setUsers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [userForm, setUserForm] = useState({ nombre: '', empresa: '', usuario: '', password: '' });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('netpro_admin_auth');
    if (auth === 'true') setIsAuth(true);
  }, []);

  useEffect(() => {
    if (isAuth) fetchAll();
  }, [isAuth]);

  const fetchAll = async () => {
    const { data: cl } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    const { data: co } = await supabase.from('portal_courses').select('*').order('created_at', { ascending: false });
    const { data: us } = await supabase.from('portal_users').select('*').order('created_at', { ascending: false });
    const { data: en } = await supabase.from('portal_enrollments').select('*');
    if (cl) setClients(cl);
    if (co) setCourses(co);
    if (us) setUsers(us);
    if (en) setEnrollments(en);
  };

  // ---- LOGIN ----
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) {
      localStorage.setItem('netpro_admin_auth', 'true');
      setIsAuth(true);
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('netpro_admin_auth');
    setIsAuth(false);
    setLoginUser(''); setLoginPass('');
  };

  const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let p=''; for(let i=0;i<8;i++) p+=chars.charAt(Math.floor(Math.random()*chars.length));
    setUserForm({...userForm, password: p});
  };

  // ---- CLIENTES FUNCS ----
  const handleClientImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingClient(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('client-images').upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from('client-images').getPublicUrl(fileName);
      setClientForm({ ...clientForm, imagen_url: data.publicUrl });
    } else alert(error.message);
    setUploadingClient(false);
  };

  const saveClient = async () => {
    const serviciosArr = clientForm.servicios.split(',').map((s:string)=>s.trim()).filter(Boolean);
    const payload = { ...clientForm, servicios: serviciosArr };
    delete payload.servicios_input;
    if (editingClientId) {
      const { error } = await supabase.from('clients').update(payload).eq('id', editingClientId);
      if (!error) { setEditingClientId(null); setClientForm({ nombre: '', categoria: 'Medicina', descripcion: '', imagen_url: '', servicios: '', metrica: '', demo_tipo: 'web', demo_url: '', website_url: '', instagram_url: '', facebook_url: '' }); fetchAll(); }
      else alert(error.message);
    } else {
      const { error } = await supabase.from('clients').insert(payload);
      if (!error) { setClientForm({ nombre: '', categoria: 'Medicina', descripcion: '', imagen_url: '', servicios: '', metrica: '', demo_tipo: 'web', demo_url: '', website_url: '', instagram_url: '', facebook_url: '' }); fetchAll(); }
      else alert(error.message);
    }
  };

  const editClient = (c: any) => {
    setClientForm({ ...c, servicios: c.servicios.join(', ') });
    setEditingClientId(c.id);
    setActiveTab('clientes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteClient = async (id: string) => {
    if (!confirm('¿Eliminar cliente?')) return;
    await supabase.from('clients').delete().eq('id', id);
    fetchAll();
  };

  // ---- CURSOS FUNCS ----
  const handleCourseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCourse(true);
    const fileName = `curso-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('client-images').upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from('client-images').getPublicUrl(fileName);
      setCourseForm({ ...courseForm, miniatura_url: data.publicUrl });
    } else alert(error.message);
    setUploadingCourse(false);
  };

  const saveCourse = async () => {
    const slug = courseForm.slug || slugify(courseForm.titulo);
    if (editingCourseId) {
      const { error } = await supabase.from('portal_courses').update({ ...courseForm, slug }).eq('id', editingCourseId);
      if (!error) { setEditingCourseId(null); setCourseForm({ titulo: '', slug: '', descripcion: '', miniatura_url: '', contenido: '' }); fetchAll(); }
      else alert(error.message);
    } else {
      const { error } = await supabase.from('portal_courses').insert({ ...courseForm, slug });
      if (!error) { setCourseForm({ titulo: '', slug: '', descripcion: '', miniatura_url: '', contenido: '' }); fetchAll(); }
      else alert(error.message);
    }
  };

  const editCourse = (c: any) => {
    setCourseForm({ titulo: c.titulo, slug: c.slug, descripcion: c.descripcion || '', miniatura_url: c.miniatura_url || '', contenido: c.contenido || '' });
    setEditingCourseId(c.id);
    setActiveTab('cursos');
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('¿Eliminar curso y accesos?')) return;
    await supabase.from('portal_courses').delete().eq('id', id);
    fetchAll();
  };

  // ---- ALUMNOS FUNCS ----
  const saveUser = async () => {
    if (!userForm.nombre || !userForm.usuario || !userForm.password) { alert('Completa nombre, usuario y contraseña'); return; }
    if (editingUserId) {
      const { error } = await supabase.from('portal_users').update(userForm).eq('id', editingUserId);
      if (!error) {
        await supabase.from('portal_enrollments').delete().eq('user_id', editingUserId);
        for (const cid of selectedCourses) await supabase.from('portal_enrollments').insert({ user_id: editingUserId, course_id: cid });
        setEditingUserId(null); setUserForm({ nombre: '', empresa: '', usuario: '', password: '' }); setSelectedCourses([]); fetchAll();
      } else alert(error.message);
    } else {
      const { data, error } = await supabase.from('portal_users').insert(userForm).select().single();
      if (!error && data) {
        for (const cid of selectedCourses) await supabase.from('portal_enrollments').insert({ user_id: data.id, course_id: cid });
        setUserForm({ nombre: '', empresa: '', usuario: '', password: '' }); setSelectedCourses([]); fetchAll();
      } else alert(error?.message);
    }
  };

  const editUser = async (u: any) => {
    setUserForm({ nombre: u.nombre, empresa: u.empresa || '', usuario: u.usuario, password: u.password });
    setEditingUserId(u.id);
    const { data } = await supabase.from('portal_enrollments').select('course_id').eq('user_id', u.id);
    if (data) setSelectedCourses(data.map((d:any)=>d.course_id));
    setActiveTab('alumnos');
  };

  const deleteUser = async (id: string) => {
    if (!confirm('¿Eliminar alumno?')) return;
    await supabase.from('portal_users').delete().eq('id', id);
    fetchAll();
  };

  // LOGIN SCREEN
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#fcf8f5] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white rounded-[2rem] border border-white shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-3"><Briefcase className="w-6 h-6 text-[#ff2a2a]" /></div>
            <h1 className="text-xl font-extrabold">Admin NetPro</h1>
            <p className="text-xs font-mono text-gray-500 mt-1">Acceso privado</p>
          </div>
          <div className="space-y-4">
            <div><label className="text-xs font-mono uppercase text-gray-600">Usuario</label><input value={loginUser} onChange={e=>setLoginUser(e.target.value)} className="w-full border p-3 rounded-xl text-sm mt-1" placeholder="admin" /></div>
            <div><label className="text-xs font-mono uppercase text-gray-600">Contraseña</label><div className="relative mt-1"><input type={showPass ? 'text' : 'password'} value={loginPass} onChange={e=>setLoginPass(e.target.value)} className="w-full border p-3 rounded-xl text-sm pr-10" placeholder="••••••••" /><button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-3.5">{showPass ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}</button></div></div>
            {loginError && <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">{loginError}</div>}
            <button type="submit" className="w-full bg-[#ff2a2a] text-white py-3 rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-red-600">Entrar</button>
            <p className="text-[11px] text-center text-gray-400 font-mono">Usuario: admin / Pass: NetPro2024!</p>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="font-extrabold text-xl">NetPro Admin</h1>
            <div className="flex gap-2">
              <button onClick={()=>setActiveTab('clientes')} className={`px-4 py-2 rounded-full text-xs font-mono uppercase font-semibold border transition-colors flex items-center gap-1.5 ${activeTab==='clientes' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:bg-gray-50'}`}><Briefcase className="w-3.5 h-3.5" /> Clientes ({clients.length})</button>
              <button onClick={()=>setActiveTab('cursos')} className={`px-4 py-2 rounded-full text-xs font-mono uppercase font-semibold border transition-colors flex items-center gap-1.5 ${activeTab==='cursos' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:bg-gray-50'}`}><BookOpen className="w-3.5 h-3.5" /> Cursos ({courses.length})</button>
              <button onClick={()=>setActiveTab('alumnos')} className={`px-4 py-2 rounded-full text-xs font-mono uppercase font-semibold border transition-colors flex items-center gap-1.5 ${activeTab==='alumnos' ? 'bg-[#ff2a2a] text-white border-[#ff2a2a]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}><Users className="w-3.5 h-3.5" /> Alumnos ({users.length})</button>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs border px-4 py-2 rounded-full hover:bg-gray-50"><LogOut className="w-4 h-4" /> Salir</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'clientes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 border h-fit sticky top-24">
              <h2 className="font-bold mb-4">{editingClientId ? 'Editar Cliente' : '+ Nuevo Cliente'}</h2>
              <div className="space-y-3">
                <input placeholder="Nombre (Ej: Dr Noé Herrera)" value={clientForm.nombre} onChange={e=>setClientForm({...clientForm, nombre: e.target.value})} className="w-full border p-3 rounded-xl text-sm" />
                <select value={clientForm.categoria} onChange={e=>setClientForm({...clientForm, categoria: e.target.value})} className="w-full border p-3 rounded-xl text-sm">{categoriasClientes.map(c=><option key={c} value={c}>{c}</option>)}</select>
                <textarea placeholder="Descripción corta" value={clientForm.descripcion} onChange={e=>setClientForm({...clientForm, descripcion: e.target.value})} className="w-full border p-3 rounded-xl text-sm h-20" />
                <div><label className="text-xs font-mono uppercase">Imagen 3:4 (subir archivo)</label><input type="file" accept="image/*" onChange={handleClientImageUpload} className="w-full text-xs mt-1" />{uploadingClient && <p className="text-xs text-red-500">Subiendo...</p>}{clientForm.imagen_url && <img src={clientForm.imagen_url} className="w-full aspect-[3/4] object-cover object-top rounded-xl mt-2" />}</div>
                <input placeholder="Imagen URL (auto si subes)" value={clientForm.imagen_url} onChange={e=>setClientForm({...clientForm, imagen_url: e.target.value})} className="w-full border p-3 rounded-xl text-sm bg-gray-50" />
                <input placeholder="Servicios separados por coma (Meta Ads, Branding)" value={clientForm.servicios} onChange={e=>setClientForm({...clientForm, servicios: e.target.value})} className="w-full border p-3 rounded-xl text-sm" />
                <input placeholder="Métrica (Ej: +180% Leads)" value={clientForm.metrica} onChange={e=>setClientForm({...clientForm, metrica: e.target.value})} className="w-full border p-3 rounded-xl text-sm" />
                <div className="grid grid-cols-2 gap-2"><select value={clientForm.demo_tipo} onChange={e=>setClientForm({...clientForm, demo_tipo: e.target.value})} className="border p-3 rounded-xl text-sm">{demoTipos.map(t=><option key={t} value={t}>{t}</option>)}</select><input placeholder="Link demo (web/video)" value={clientForm.demo_url} onChange={e=>setClientForm({...clientForm, demo_url: e.target.value})} className="border p-3 rounded-xl text-sm" /></div>
                <input placeholder="Link Sitio Web" value={clientForm.website_url} onChange={e=>setClientForm({...clientForm, website_url: e.target.value})} className="w-full border p-3 rounded-xl text-sm" />
                <div className="grid grid-cols-2 gap-2"><input placeholder="Instagram URL" value={clientForm.instagram_url} onChange={e=>setClientForm({...clientForm, instagram_url: e.target.value})} className="border p-3 rounded-xl text-sm" /><input placeholder="Facebook URL" value={clientForm.facebook_url} onChange={e=>setClientForm({...clientForm, facebook_url: e.target.value})} className="border p-3 rounded-xl text-sm" /></div>
                <button onClick={saveClient} className="w-full bg-black text-white py-3 rounded-xl text-sm font-semibold">{editingClientId ? 'Actualizar Cliente' : 'Crear Cliente'}</button>
                {editingClientId && <button onClick={()=>{setEditingClientId(null); setClientForm({ nombre: '', categoria: 'Medicina', descripcion: '', imagen_url: '', servicios: '', metrica: '', demo_tipo: 'web', demo_url: '', website_url: '', instagram_url: '', facebook_url: '' });}} className="w-full border py-3 rounded-xl text-sm">Cancelar</button>}
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map(c=>(
                <div key={c.id} className="bg-white rounded-2xl border overflow-hidden">
                  <img src={c.imagen_url} className="w-full aspect-[3/4] object-cover object-top" />
                  <div className="p-4"><p className="font-bold text-sm">{c.nombre}</p><p className="text-xs text-gray-500">{c.categoria} • {c.metrica}</p><div className="flex gap-2 mt-3"><button onClick={()=>editClient(c)} className="text-xs border px-3 py-1 rounded-full flex items-center gap-1"><Edit className="w-3 h-3" /> Editar</button><button onClick={()=>deleteClient(c.id)} className="text-xs border border-red-200 text-red-600 px-3 py-1 rounded-full flex items-center gap-1"><Trash2 className="w-3 h-3" /> Eliminar</button></div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cursos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 border h-fit sticky top-24">
              <h2 className="font-bold mb-4">{editingCourseId ? 'Editar Curso' : '+ Nuevo Curso'}</h2>
              <div className="space-y-3">
                <input placeholder="Título del curso" value={courseForm.titulo} onChange={e=>setCourseForm({...courseForm, titulo: e.target.value, slug: slugify(e.target.value)})} className="w-full border p-3 rounded-xl text-sm" />
                <input placeholder="Slug auto" value={courseForm.slug} onChange={e=>setCourseForm({...courseForm, slug: e.target.value})} className="w-full border p-3 rounded-xl text-sm bg-gray-50" />
                <div><label className="text-xs font-mono uppercase">Miniatura 16:10 (subir)</label><input type="file" accept="image/*" onChange={handleCourseImageUpload} className="w-full text-xs mt-1" />{uploadingCourse && <p className="text-xs text-red-500">Subiendo...</p>}{courseForm.miniatura_url && <img src={courseForm.miniatura_url} className="w-full aspect-[16/10] object-cover rounded-xl mt-2" />}</div>
                <input placeholder="Miniatura URL" value={courseForm.miniatura_url} onChange={e=>setCourseForm({...courseForm, miniatura_url: e.target.value})} className="w-full border p-3 rounded-xl text-sm bg-gray-50" />
                <textarea placeholder="Descripción corta del curso" value={courseForm.descripcion} onChange={e=>setCourseForm({...courseForm, descripcion: e.target.value})} className="w-full border p-3 rounded-xl text-sm h-20" />
                <textarea placeholder="Contenido / Links de videos / Temario (texto largo)" value={courseForm.contenido} onChange={e=>setCourseForm({...courseForm, contenido: e.target.value})} className="w-full border p-3 rounded-xl text-sm h-32" />
                <button onClick={saveCourse} className="w-full bg-black text-white py-3 rounded-xl text-sm font-semibold">{editingCourseId ? 'Actualizar Curso' : 'Crear Curso'}</button>
                {editingCourseId && <button onClick={()=>{setEditingCourseId(null); setCourseForm({ titulo: '', slug: '', descripcion: '', miniatura_url: '', contenido: '' });}} className="w-full border py-3 rounded-xl text-sm">Cancelar</button>}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-3">
              {courses.map(c=>(
                <div key={c.id} className="bg-white rounded-2xl border p-4 flex gap-4">
                  <img src={c.miniatura_url} className="w-24 h-16 rounded-xl object-cover" />
                  <div className="flex-1"><p className="font-bold text-sm">{c.titulo}</p><p className="text-xs font-mono text-gray-500">{c.slug}</p><p className="text-xs text-gray-600 mt-1 line-clamp-2">{c.descripcion}</p></div>
                  <div className="flex flex-col gap-1"><button onClick={()=>editCourse(c)} className="text-xs border px-3 py-1 rounded-full">Editar</button><button onClick={()=>deleteCourse(c.id)} className="text-xs border border-red-200 text-red-600 px-3 py-1 rounded-full">Eliminar</button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alumnos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 border h-fit sticky top-24">
              <h2 className="font-bold mb-4">{editingUserId ? 'Editar Alumno' : '+ Nuevo Alumno'}</h2>
              <div className="space-y-3">
                <input placeholder="Nombre completo" value={userForm.nombre} onChange={e=>setUserForm({...userForm, nombre: e.target.value})} className="w-full border p-3 rounded-xl text-sm" />
                <input placeholder="Empresa / Marca" value={userForm.empresa} onChange={e=>setUserForm({...userForm, empresa: e.target.value})} className="w-full border p-3 rounded-xl text-sm" />
                <input placeholder="Usuario (ej: ana.garcia)" value={userForm.usuario} onChange={e=>setUserForm({...userForm, usuario: e.target.value})} className="w-full border p-3 rounded-xl text-sm" />
                <div className="flex gap-2"><input placeholder="Contraseña" value={userForm.password} onChange={e=>setUserForm({...userForm, password: e.target.value})} className="flex-1 border p-3 rounded-xl text-sm" /><button onClick={generatePassword} type="button" className="px-4 border rounded-xl text-xs font-mono">Aleatoria</button></div>
                <div><p className="text-xs font-mono uppercase text-gray-600 mb-2">Asignar cursos (puede ser 1 o varios)</p><div className="space-y-2 max-h-48 overflow-y-auto">{courses.map(c=>(<label key={c.id} className="flex items-center gap-2 text-sm border p-2.5 rounded-xl cursor-pointer"><input type="checkbox" checked={selectedCourses.includes(c.id)} onChange={e=>{ if(e.target.checked) setSelectedCourses([...selectedCourses, c.id]); else setSelectedCourses(selectedCourses.filter(id=>id!==c.id)); }} />{c.titulo}</label>))}{courses.length===0 && <p className="text-xs text-gray-400">Primero crea un curso en la pestaña Cursos</p>}</div></div>
                <button onClick={saveUser} className="w-full bg-[#ff2a2a] text-white py-3 rounded-xl text-sm font-semibold">{editingUserId ? 'Actualizar Alumno' : 'Crear Alumno + Accesos'}</button>
                {editingUserId && <button onClick={()=>{setEditingUserId(null); setUserForm({ nombre: '', empresa: '', usuario: '', password: '' }); setSelectedCourses([]);}} className="w-full border py-3 rounded-xl text-sm">Cancelar</button>}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-3">
              {users.map(u=>{
                const userEnrolls = enrollments.filter(en=>en.user_id===u.id);
                const courseNames = userEnrolls.map(en=>courses.find(c=>c.id===en.course_id)?.titulo).filter(Boolean);
                return (
                  <div key={u.id} className="bg-white rounded-2xl border p-4">
                    <div className="flex justify-between"><div><p className="font-bold text-sm">{u.nombre} <span className="font-normal text-gray-500">({u.empresa})</span></p><p className="text-xs font-mono mt-1">@{u.usuario} / Pass: {u.password}</p><p className="text-[11px] mt-2 bg-gray-50 border px-2 py-1 rounded-full inline-block">{courseNames.length ? courseNames.join(', ') : 'Sin cursos asignados'}</p></div><div className="flex flex-col gap-1"><button onClick={()=>editUser(u)} className="text-xs border px-3 py-1 rounded-full">Editar</button><button onClick={()=>deleteUser(u.id)} className="text-xs border border-red-200 text-red-600 px-3 py-1 rounded-full">Eliminar</button></div></div>
                  </div>
                );
              })}
              {users.length===0 && <div className="bg-white rounded-2xl border p-10 text-center text-sm text-gray-500">Aún no hay alumnos. Crea el primero arriba.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}