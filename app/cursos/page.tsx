'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Lock, User, LogIn, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

type Course = {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  miniatura_url: string;
};

export default function CursosPortalPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
    const session = localStorage.getItem('portal_user');
    if (session) router.push('/cursos/dashboard');
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase
      .from('portal_courses')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setCourses(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/portal-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Credenciales incorrectas');
      setLoading(false);
      return;
    }

    localStorage.setItem('portal_user', JSON.stringify(data.user));
    localStorage.setItem('portal_enrollments', JSON.stringify(data.enrollments));
    router.push('/cursos/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fcf8f5]">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs font-mono tracking-widest uppercase text-[#ff2a2a] bg-red-50 px-3 py-1 rounded-full border border-red-100 font-semibold">
              Portal de Alumnos
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 text-gray-900">
              Portal Cursos
            </h1>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm">
              Explora los cursos disponibles. Inicia sesión abajo para acceder al contenido asignado a tu usuario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {courses.map((course) => (
              <div key={course.id} className="group bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img 
                    src={course.miniatura_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
                    alt={course.titulo} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white">
                    <span className="text-[10px] font-mono font-bold text-[#ff2a2a] uppercase flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Curso
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{course.titulo}</h3>
                  <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">{course.descripcion}</p>
                  <div className="mt-5 flex items-center text-xs font-mono text-gray-500 gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#ff2a2a]" /> Acceso con usuario y contraseña
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-[#ff2a2a]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Acceso a Cursos</h2>
              <p className="text-xs text-gray-500 font-mono mt-1">Ingresa tu usuario asignado por NetPro</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-gray-600 mb-1.5 block">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    value={usuario} 
                    onChange={e => setUsuario(e.target.value)} 
                    placeholder="Ej: juan.perez" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff2a2a] focus:ring-2 focus:ring-red-100 outline-none text-sm bg-white" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-gray-600 mb-1.5 block">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff2a2a] focus:ring-2 focus:ring-red-100 outline-none text-sm bg-white" 
                    required 
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-mono text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#ff2a2a] text-white font-semibold py-3.5 rounded-full hover:bg-red-600 transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verificando...' : <><LogIn className="w-4 h-4" /> Entrar al Portal</>}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}