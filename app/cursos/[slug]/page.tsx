'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, BookOpen } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

export default function CursoDetallePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const storedUser = localStorage.getItem('portal_user');
      if (!storedUser) { router.push('/cursos'); return; }
      const { data: courseData } = await supabase.from('portal_courses').select('*').eq('slug', slug).single();
      if (!courseData) { router.push('/cursos/dashboard'); return; }
      setCourse(courseData);
      const user = JSON.parse(storedUser);
      const { data: direct } = await supabase.from('portal_enrollments').select('course_id').eq('user_id', user.id).eq('course_id', courseData.id).maybeSingle();
      if (direct) setHasAccess(true);
      setLoading(false);
    };
    check();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#fcf8f5] flex items-center justify-center"><Navbar /><div className="pt-28 font-mono text-sm">Verificando acceso...</div></div>;
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#fcf8f5]"><Navbar /><div className="flex items-center justify-center px-6 pt-40"><div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-10 text-center max-w-md shadow-xl"><h2 className="font-bold text-xl">Sin acceso</h2><p className="text-sm text-gray-600 mt-2">No tienes acceso a este curso.</p><button onClick={()=>router.push('/cursos/dashboard')} className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest">Volver</button></div></div></div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8f5]">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={()=>router.push('/cursos/dashboard')} className="mb-6 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest border border-gray-200 bg-white/80 backdrop-blur px-4 py-2 rounded-full hover:bg-white shadow-sm"><ArrowLeft className="w-3.5 h-3.5" /> Volver a mis cursos</button>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            {course.video_url ? (
              <div className="relative aspect-video bg-black"><video src={course.video_url} controls className="w-full h-full" poster={course.miniatura_url} /></div>
            ) : (
              <div className="relative aspect-[16/9]"><img src={course.miniatura_url} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><h1 className="absolute bottom-6 left-6 right-6 text-white text-3xl font-extrabold tracking-tight">{course.titulo}</h1></div>
            )}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-3"><span className="text-[10px] font-mono uppercase tracking-widest bg-red-50 border border-red-100 text-[#ff2a2a] px-3 py-1 rounded-full font-bold flex items-center gap-1"><BookOpen className="w-3 h-3" /> Curso Activo</span></div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{course.titulo}</h1>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">{course.descripcion}</p>
              {course.video_url && <div className="mt-6"><a href={course.video_url} download className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest border border-gray-200 bg-white px-4 py-2 rounded-full hover:bg-gray-50 shadow-sm"><Download className="w-3.5 h-3.5" /> Descargar video</a></div>}
              <div className="mt-8 p-6 bg-[#fcf8f5] rounded-2xl border border-white"><p className="text-[11px] font-mono uppercase tracking-widest text-gray-500 mb-3">Contenido / Temario</p><div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{course.contenido || 'Pronto se agregará el contenido detallado.'}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

