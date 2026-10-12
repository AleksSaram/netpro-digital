import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type CategoriaCliente = 'Medicina' | 'Educación' | 'Marcas Personales' | 'Multinivel' | 'Belleza' | 'Eventos'
export type DemoTipo = 'web' | 'video' | 'feed' | 'branding'

export interface Client {
  id: string
  nombre: string
  categoria: CategoriaCliente
  imagen_url: string
  descripcion: string
  servicios: string[]
  demo_tipo: DemoTipo
  demo_url: string
  demo_thumb?: string
  metrica?: string
  instagram_url?: string
  facebook_url?: string
  website_url?: string
  tiktok_url?: string
  created_at?: string
}