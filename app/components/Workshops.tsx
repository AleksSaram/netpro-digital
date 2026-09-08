import { GraduationCap, Users, Laptop, CheckCircle2, ArrowRight } from "lucide-react";

export default function Workshops() {
  const workshopItems = [
    {
      title: "Talleres Prácticos para Equipos",
      description: "Capacitaciones dinámicas in-house u online diseñadas para que el equipo de tu empresa domine habilidades digitales de inmediato.",
      features: [
        "Creación de contenido fácil y profesional",
        "Cómo crear Reels que conecten y vendan",
        "Meta Ads desde cero para negocios",
        "Uso de Inteligencia Artificial en marketing"
      ],
      icon: Users,
      badge: "In-House o Online"
    },
    {
      title: "Cursos y Programas Completos",
      description: "Programas formativos de varias sesiones orientados a emprendedores, profesionales y equipos de ventas que buscan resultados profundos.",
      features: [
        "Curso de Creación de Contenido y Redes",
        "Estrategia Digital Aplicada",
        "Capacitaciones personalizadas 1 a 1",
        "Acompañamiento en grupos reducidos"
      ],
      icon: GraduationCap,
      badge: "Programa Integral"
    }
  ];

  return (
    <section id="talleres" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado de la sección */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 mb-4">
            <Laptop className="w-4 h-4 text-[#ff2a2a]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#ff2a2a]">
              Capacitación y Cursos
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Empodera a tu equipo con <span className="text-[#ff2a2a]">conocimiento real</span>.
          </h2>
          <p className="text-gray-600 text-lg">
            No solo hacemos el trabajo por ti; también entrenamos a tu personal para dominar las herramientas digitales que mueven el mercado actual.
          </p>
        </div>

        {/* Grid de Talleres con estilo visual inmersivo y limpio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {workshopItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index}
                className="group bg-[#f8f9fa] rounded-3xl p-10 border border-gray-200/80 hover:border-red-200 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Etiqueta superior y Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#ff2a2a] group-hover:bg-[#ff2a2a] group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#ff2a2a] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-8">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-gray-200/60 pt-6">
                  <ul className="space-y-3">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-[#ff2a2a] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-4 flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-[#ff2a2a] transition-colors cursor-pointer">
                    <span>Solicitar programa detallado</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}