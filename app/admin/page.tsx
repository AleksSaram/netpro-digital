'use client';

import { useState, useEffect } from 'react';
import { supabase, Client } from '@/app/lib/supabase';

export default function AdminPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [form, setForm] = useState<any>({
    nombre: '',
    categoria: 'Medicina',
    imagen_url: '',
    descripcion: '',
    servicios: [],
    demo_tipo: 'web',
    demo_url: '',
    metrica: '',
    instagram_url: '',
    facebook_url: '',
    website_url: '',
    tiktok_url: ''
  });
  const [serviciosInput, setServiciosInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('netpro_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchClients();
    }
  }, []);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'NetPro2024!') {
      localStorage.setItem('netpro_admin_auth', 'true');
      setIsAuthenticated(true);
      fetchClients();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (data) setClients(data as any[]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('client-images').upload(fileName, file);
    if (error) {
      alert('Error subiendo imagen: ' + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('client-images').getPublicUrl(fileName);
    setForm({ ...form, imagen_url: data.publicUrl });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.imagen_url) {
      alert('Nombre e imagen son obligatorios');
      return;
    }

    const payload = {
      ...form,
      servicios: form.servicios || []
    };

    let error;
    if (editingId) {
      const res = await supabase.from('clients').update(payload).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('clients').insert([payload]);
      error = res.error;
    }

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setForm({ nombre: '', categoria: 'Medicina', imagen_url: '', descripcion: '', servicios: [], demo_tipo: 'web', demo_url: '', metrica: '', instagram_url: '', facebook_url: '', website_url: '', tiktok_url: '' });
      setServiciosInput('');
      setEditingId(null);
      fetchClients();
    }
  };

  const handleEdit = (client: any) => {
    setForm(client);
    setServiciosInput(client.servicios.join(', '));
    setEditingId(client.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Borrar este cliente?')) return;
    await supabase.from('clients').delete().eq('id', id);
    fetchClients();
  };

  const addServicio = () => {
    if (!serviciosInput.trim()) return;
    const nuevos = serviciosInput.split(',').map(s => s.trim()).filter(Boolean);
    setForm({ ...form, servicios: [...(form.servicios || []), ...nuevos] });
    setServiciosInput('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] p-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-sm w-full">
          <h1 className="text-xl font-bold mb-2">Admin NetPro</h1>
          <p className="text-sm text-gray-600 mb-6">Ingresa la contraseña para gestionar clientes. URL: /admin</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 text-sm" />
          <button onClick={handleLogin} className="w-full bg-[#ff2a2a] text-white py-3 rounded-xl font-semibold text-sm">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold">Panel Clientes - NetPro</h1>
            <p className="text-sm text-gray-600">Ahora puedes agregar redes sociales del cliente + tipo de demo correcto</p>
          </div>
          <button onClick={() => { localStorage.removeItem('netpro_admin_auth'); location.reload(); }} className="text-xs font-mono text-gray-500 border border-gray-200 px-3 py-1 rounded-full">Salir</button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm mb-10 space-y-5">
          <h2 className="font-bold text-lg">{editingId ? 'Editar cliente' : 'Nuevo cliente'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-700">Nombre del cliente</label>
              <input required value={form.nombre || ''} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-1" placeholder="Ej. Dr Noé Herrera" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700">Categoría</label>
              <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value as any})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-1">
                <option>Medicina</option>
                <option>Educación</option>
                <option>Marcas Personales</option>
                <option>Multinivel</option>
                <option>Belleza</option>
                <option>Eventos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-700">Imagen</label>
            <div className="flex gap-2 mt-1">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
              {uploading && <span className="text-xs text-[#ff2a2a] animate-pulse">Subiendo...</span>}
            </div>
            <input value={form.imagen_url || ''} onChange={e => setForm({...form, imagen_url: e.target.value})} placeholder="URL" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-2" />
            {form.imagen_url && <img src={form.imagen_url} alt="preview" className="w-32 h-20 object-cover rounded-xl mt-2 border" />}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-700">Descripción corta</label>
            <textarea required value={form.descripcion || ''} onChange={e => setForm({...form, descripcion: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-1" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-700">Servicios (separados por coma)</label>
            <div className="flex gap-2 mt-1">
              <input value={serviciosInput} onChange={e => setServiciosInput(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="Diseño Web, Meta Ads, Branding" />
              <button type="button" onClick={addServicio} className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold">Agregar</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(form.servicios || []).map((s: string, i: number) => (
                <span key={i} className="bg-red-50 border border-red-100 text-[#ff2a2a] px-2.5 py-1 rounded-full text-xs flex items-center gap-1">{s} <button type="button" onClick={() => setForm({...form, servicios: form.servicios?.filter((_: any, idx: number) => idx !== i)})} className="ml-1 font-bold">×</button></span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-700">Tipo de trabajo real</label>
              <select value={form.demo_tipo} onChange={e => setForm({...form, demo_tipo: e.target.value as any})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-1">
                <option value="web">Sitio Web</option>
                <option value="video">Video / Edición</option>
                <option value="feed">Feed / Contenido</option>
                <option value="branding">Branding</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700">URL del demo</label>
              <input value={form.demo_url || ''} onChange={e => setForm({...form, demo_url: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-1" placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700">Métrica</label>
              <input value={form.metrica || ''} onChange={e => setForm({...form, metrica: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-1" placeholder="+180% Leads" />
            </div>
          </div>

          <div className="border-t pt-5">
            <p className="text-xs font-bold uppercase text-gray-700 mb-3">Redes sociales del cliente (opcional - se muestran en el modal)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] uppercase text-gray-500">Instagram URL</label>
                <input value={form.instagram_url || ''} onChange={e => setForm({...form, instagram_url: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-1" placeholder="https://instagram.com/cliente" />
              </div>
              <div>
                <label className="text-[11px] uppercase text-gray-500">Facebook URL</label>
                <input value={form.facebook_url || ''} onChange={e => setForm({...form, facebook_url: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-1" placeholder="https://facebook.com/cliente" />
              </div>
              <div>
                <label className="text-[11px] uppercase text-gray-500">Website URL</label>
                <input value={form.website_url || ''} onChange={e => setForm({...form, website_url: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm mt-1" placeholder="https://cliente.com" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#ff2a2a] text-white py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider">{editingId ? 'Actualizar cliente' : 'Guardar cliente'}</button>
        </form>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between">
            <h3 className="font-bold">Clientes actuales ({clients.length})</h3>
            <span className="text-xs font-mono text-gray-500">Entra en /admin con contraseña</span>
          </div>
          <div className="divide-y divide-gray-100">
            {clients.map((c: any) => (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <img src={c.imagen_url} alt={c.nombre} className="w-12 h-12 rounded-xl object-cover border" />
                  <div>
                    <div className="font-semibold text-sm">{c.nombre} <span className="text-[10px] bg-gray-100 border px-2 py-0.5 rounded-full ml-2">{c.categoria} • {c.demo_tipo}</span></div>
                    <div className="text-xs text-gray-500 truncate max-w-[300px]">{c.descripcion}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(c)} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:bg-white">Editar</button>
                  <button onClick={() => handleDelete(c.id)} className="text-xs px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#ff2a2a]">Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

