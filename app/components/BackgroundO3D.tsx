'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

export default function BackgroundO3D() {
  // Capturamos el progreso del scroll de la página (de 0 a 1)
  const { scrollYProgress } = useScroll();

  // Rotación sutil: desde 0° al inicio hasta solo 45° al llegar al final de la página
  const rawRotation = useTransform(scrollYProgress, [0, 1], [0, 45]);
  
  // Aplicamos un resorte (spring) para que el giro tenga una inercia suave y elegante
  const rotation = useSpring(rawRotation, {
    stiffness: 40, 
    damping: 30,   
    restDelta: 0.001
  });

  // Desplazamiento vertical muy suave para darle profundidad (paralaje)
  const rawTranslateY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const translateY = useSpring(rawTranslateY, {
    stiffness: 30,
    damping: 25
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
      {/* Contenedor central con la "O" y rotación sutil */}
      <motion.div 
        className="relative w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] opacity-[0.05] select-none"
        style={{
          y: translateY,
          rotate: rotation,
          transformStyle: 'preserve-3d',
        }}
      >
        <Image
          src="/isotipo-o.png"
          alt="NetPro Background Isotype"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  );
}