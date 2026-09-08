export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  categoryKey: 'web' | 'realestate' | 'branding' | 'marketing';
  description: string;
  image: string;
  metrics: string;
  tags: string[];
  link?: string;
}

export const projectsData: Project[] = [
  {
    id: "umbrall-estate",
    number: "01",
    title: "Umbrall Real Estate Portal",
    category: "Web Inmersiva & Next.js",
    categoryKey: "web",
    description: "Plataforma inmobiliaria de alto rendimiento desarrollada con Next.js y Tailwind CSS. Incluye filtros avanzados, recorridos virtuales y optimización extrema de velocidad.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
    metrics: "+140% Conversión de Leads",
    tags: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    link: "https://umbralrealestate.umbrallstudio.online"
  },
  {
    id: "juriquilla-luxury",
    number: "02",
    title: "Residencial Juriquilla High-End",
    category: "Real Estate & Meta Ads",
    categoryKey: "realestate",
    description: "Estrategia integral de captación de leads inmobiliarios mediante campañas hipersegmentadas en Meta Ads y automatización directa con HubSpot CRM.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
    metrics: "ROI 6.4x en pauta",
    tags: ["Meta Ads", "HubSpot CRM", "Lead Gen", "Estrategia"],
  },
  {
    id: "amun-editorial",
    number: "03",
    title: "Amun Editorial Video & Branding",
    category: "Producción & Dirección",
    categoryKey: "branding",
    description: "Dirección de arte, guionismo y edición de piezas audiovisuales de alta gama inspiradas en estética editorial minimalista para posicionamiento de marca.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
    metrics: "+500k Alcance Orgánico",
    tags: ["Premiere Pro", "After Effects", "Color Grading", "Branding"],
  },
  {
    id: "respira-bienestar",
    number: "04",
    title: "Respira Bienestar Mental Portal",
    category: "Plataforma Web & WordPress",
    categoryKey: "web",
    description: "Desarrollo de dashboard personalizado para pacientes, seguimiento de sesiones, automatización de membresías y facturación integrada.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
    metrics: "Automatización 100%",
    tags: ["WordPress Custom", "UX/UI", "Billing API", "Dashboard"],
  }
];