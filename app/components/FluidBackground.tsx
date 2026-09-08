'use client';

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Fondo base ultra limpio */}
      <div className="absolute inset-0 bg-[#fafbfc]"></div>

      {/* Una única mancha fluida en tono azul/plata muy sutil (Cero sensación de suciedad) */}
      <div className="absolute top-[-10%] left-[15%] w-[700px] h-[700px] bg-slate-200/50 rounded-full blur-[140px] animate-fluid-1"></div>

      {/* Mancha secundaria de contraste técnico muy suave */}
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[160px] animate-fluid-2"></div>
    </div>
  );
}