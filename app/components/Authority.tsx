import { ShieldCheck, Award, TrendingUp, Users } from "lucide-react";

export default function Authority() {
  return (
    <section id="autoridad" className="py-24 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#ff2a2a]">
                Liderazgo y Autoridad
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              Transformamos negocios en marcas con presencia, autoridad y credibilidad.
            </h2>
            
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Soy <strong className="text-gray-900 font-semibold">Ricardo Zúñiga</strong>, consultor y estratega en medios digitales. A través de NetPro Digital, ayudamos a que las empresas dejen de ser invisibles en internet.
            </p>

            <p className="text-gray-600 text-base leading-relaxed">
              Nuestro objetivo no es simplemente que tu marca se vea bonita: <strong className="text-gray-900 font-medium">queremos que sea reconocida, recordada y elegida.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-200/60">
              <ShieldCheck className="w-8 h-8 text-[#ff2a2a] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confianza</h3>
              <p className="text-gray-600 text-sm">Cimientos sólidos para que tu audiencia confíe en ti.</p>
            </div>
            <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-200/60">
              <Award className="w-8 h-8 text-[#ff2a2a] mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Identidad</h3>
              <p className="text-gray-600 text-sm">Diseño minimalista que destaca en cualquier plataforma.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}