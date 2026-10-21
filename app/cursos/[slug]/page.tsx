'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter, useParams } from 'next/navigation';

export default function CursoDetallePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const storedUser = localStorage.getItem('portal_user');
      const storedEnroll = localStorage.getItem('portal_enrollments');
      if (!storedUser) { router.push('/cursos'); return; }

      const enroll = JSON.parse(storedEnroll || '[]');
      // Verificar si tiene acceso a este slug
      const { data: courseData } = await supabase.from('portal_courses').select('*').eq('slug', slug).single();
      if (!courseData) { router.push('/cursos/dashboard'); return; }
      setCourse(courseData);

      const has = enroll.some((e: any) => e.portal_courses?.slug === slug || e.course_id === courseData.id);
      // También verificar por si enroll viene como lista de cursos mapeados
      const enrolledSlugs = enroll.map((e: any) => e.portal_courses?.slug).filter(Boolean);
      const enrolledIds = enroll.map((e: any) => e.course_id).filter(Boolean);

      if (enrolledSlugs.includes(slug) || enrolledIds.includes(courseData.id) || enroll.length === 0) {
        // Si enroll.length 0 y viene directo de login con join, revisar
        // fallback: si el usuario tiene al menos un curso y ese curso es el actual
        setHasAccess(true);
      } else {
        // Chequeo extra directo en DB por seguridad
        const user = JSON.parse(storedUser);
        const { data: direct } = await supabase.from('portal_enrollments').select('course_id').eq('user_id', user.id).eq('course_id', courseData.id).maybeSingle();
        if (direct) setHasAccess(true);
        else setHasAccess(false);
      }
      setLoading(false);
    };
    check();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Verificando acceso...</div>;

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf8f5] px-6">
        <div className="bg-white border rounded-3xl p-10 text-center max-w-md">
          <h2 className="font-bold text-xl">Sin acceso</h2>
          <p className="text-sm text-gray-600 mt-2">No tienes acceso a este curso. Contacta a NetPro para asignártelo.</p>
          <button onClick={()=>router.push('/cursos/dashboard')} className="mt-6 bg-black text-white px-6 py-3 rounded-xl text-sm cursor-pointer">Volver al Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8f5] pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={()=>router.push('/cursos/dashboard')} className="text-xs font-mono uppercase border bg-white px-4 py-2 rounded-full mb-6 cursor-pointer">← Volver</button>
        <div className="bg-white rounded-[2rem] overflow-hidden border border-white shadow-xl">
          <div className="relative aspect-[16/9] bg-black">
            <img src={course.miniatura_url} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h1 className="absolute bottom-6 left-6 right-6 text-white text-3xl font-extrabold">{course.titulo}</h1>
          </div>
          <div className="p-8">
            <p className="text-gray-600 text-sm leading-relaxed">{course.descripcion}</p>
            <div className="mt-6 p-6 bg-gray-50 rounded-2xl border">
              <p className="text-xs font-mono uppercase text-gray-500 mb-2">Contenido del curso</p>
              <pre className="text-sm whitespace-pre-wrap text-gray-800">{course.contenido || 'Aquí irá el temario, videos y recursos. Por ahora puedes pegar links de YouTube, Drive, etc.'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
