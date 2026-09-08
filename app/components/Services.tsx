import { servicesData } from "@/app/lib/servicesData";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Services() {
  return (
    <section id="servicios" className="py-24 px-6 bg-[#f8f9fa] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#ff2a2a]">
              Ecosistema Integral
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Soluciones diseñadas para que <span className="text-[#ff2a2a]">tu marca sea elegida</span>.
          </h2>
          <p className="text-gray-600 text-lg">
            No solo hacemos que tu negocio se vea bien; construimos todo el engranaje estratégico, visual y publicitario que necesitas para dominar tu mercado.
          </p>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className={`group relative bg-white rounded-2xl p-8 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${
                service.highlight 
                  ? "border-red-200 bg-gradient-to-b from-white to-red-50/30 lg:col-span-2" 
                  : "border-gray-200/80 hover:border-gray-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-gray-200 group-hover:text-[#ff2a2a]/20 transition-colors">
                    {service.number}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#ff2a2a] group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#ff2a2a] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-4">
                <ul className="space-y-2.5">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs font-medium text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#ff2a2a] flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}