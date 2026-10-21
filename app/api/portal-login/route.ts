import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// Simple login sin hash por ahora (luego podemos poner bcrypt)
export async function POST(req: NextRequest) {
  const { usuario, password } = await req.json();

  if (!usuario || !password) {
    return NextResponse.json({ error: 'Falta usuario o contraseña' }, { status: 400 });
  }

  // Buscar usuario
  const { data: user, error } = await supabase
    .from('portal_users')
    .select('*')
    .eq('usuario', usuario)
    .eq('password', password)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
  }

  // Buscar a qué cursos tiene acceso
  const { data: enrollments } = await supabase
    .from('portal_enrollments')
    .select('course_id, portal_courses(id, titulo, slug)')
    .eq('user_id', user.id);

  // No devolvemos password
  const safeUser = {
    id: user.id,
    nombre: user.nombre,
    empresa: user.empresa,
    usuario: user.usuario
  };

  return NextResponse.json({ user: safeUser, enrollments: enrollments || [] });
}
