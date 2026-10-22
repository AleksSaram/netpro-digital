'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, Play } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

export default function DashboardCursos() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('portal_user');
    const storedEnroll = localStorage.getItem('portal_enrollments');
    if (!storedUser) { router.push('/cursos'); return; }
    const u = JSON.parse(storedUser);
    const enroll = JSON.parse(storedEnroll || '[]');
    setUser(u);
    const courseIds = enroll.map((e: any) => e.course_id).filter(Boolean);
    if (courseIds.length > 0) {
      supabase.from('portal_courses').select('*').in('id', courseIds).then(({ data }) => {
        if (data) setCourses(data);
        setLoading(false);
      });
    } else {
      const mapped = enroll.map((e: any) => e.portal_courses).filter(Boolean);
      if (mapped.length > 0) setCourses(mapped);
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('portal_user');
    localStorage.removeItem('portal_enrollments');
    router.push('/cursos');
  };

  if (loading) return <div className="min-h-screen bg-[#fcf8f5] flex items-center justify-center"><Navbar /><div className="pt-28 font-mono text-sm">Cargando...</div></div>;

  return (
    <div className="min-h-screen bg-[#fcf8f5]">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-xl border border-white rounded-full px-6 py-3 shadow-sm">
            <div><h1 className="text-sm font-bold uppercase tracking-widest">Hola, {user?.nombre}</h1><p className="text-[11px] text-gray-600 font-mono mt-0.5">{user?.empresa} • @{user?.usuario}</p></div>
            <button onClick={logout} className="flex items-center gap-2 text-[11px] font-mono uppercase border border-gray-200 bg-white px-4 py-2 rounded-full hover:bg-gray-50"><LogOut className="w-3.5 h-3.5" /> Salir</button>
          </div>

          {courses.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-10 text-center shadow-sm"><p className="text-gray-600 text-sm">Aún no tienes cursos asignados. Contacta a NetPro Digital.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course: any) => (
                <div key={course.id} onClick={() => router.push(`/cursos/${course.slug}`)} className="cursor-pointer bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all group">
                  <div className="relative aspect-[16/10] overflow-hidden"><img src={course.miniatura_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /><div className="absolute inset-0 bg-black/20" /><div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-[#ff2a2a]" /><span className="text-[11px] font-mono uppercase font-bold">Ver Curso</span></div></div>
                  <div className="p-6"><h3 className="font-bold text-lg text-gray-900 leading-tight">{course.titulo}</h3><p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.descripcion}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}