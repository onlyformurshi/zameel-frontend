import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, PerspectiveCamera, Preload } from '@react-three/drei';
import { useThemeStore } from '../../store/themeStore';
import * as THREE from 'three';

const letters = [
  // English letters (uppercase and lowercase for more variety)
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  
  // Arabic letters (full set)
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن',
  'ه', 'و', 'ي', 'ء', 'ة', 'ى', 'آ', 'أ', 'إ', 'ؤ', 'ئ'
];

const Scene = () => {
  const { isDarkMode } = useThemeStore();
  const groupRef = useRef<THREE.Group>(null);
  const lettersRef = useRef<THREE.Group[]>([]);
  const baseRadius = 4;
  const letterCount = 150;
  const maxScatter = 30;
  const [scrollProgress, setScrollProgress] = useState(0);

  // Memoize scatter directions
  const scatterDirections = useMemo(() => Array.from({ length: letterCount }, () => [
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2
  ]), [letterCount]);

  // Memoize base positions
  const basePositions = useMemo(() => {
    return Array.from({ length: letterCount }).map((_, index) => {
      const phi = Math.acos(1 - 2 * (index + 0.5) / letterCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
      
      return [
        baseRadius * Math.cos(theta) * Math.sin(phi),
        baseRadius * Math.sin(theta) * Math.sin(phi),
        baseRadius * Math.cos(phi)
      ];
    });
  }, [letterCount, baseRadius]);

  const createSpherePosition = (index: number, scatterAmount = 0) => {
    const basePosition = basePositions[index];
    
    if (scatterAmount === 0) return basePosition;

    const [scatterX, scatterY, scatterZ] = scatterDirections[index];
    // Exponential scatter for more dramatic effect
    const scatterStrength = maxScatter * Math.pow(scatterAmount, 2);

    return [
      basePosition[0] + scatterX * scatterStrength,
      basePosition[1] + scatterY * scatterStrength,
      basePosition[2] + scatterZ * scatterStrength
    ];
  };

  // Throttled scroll handler
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.min(window.scrollY / scrollHeight, 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimized animation frame
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime() * 0.1;
    groupRef.current.rotation.y = time * (1 - scrollProgress);

    // Update all letters but with optimized calculations
    lettersRef.current.forEach((letter, i) => {
      if (!letter) return;

      const [x, y, z] = createSpherePosition(i, scrollProgress);
      const lerpSpeed = 0.1 + scrollProgress * 0.3;
      
      letter.position.lerp(new THREE.Vector3(x, y, z), lerpSpeed);

      if (scrollProgress > 0) {
        const rotationSpeed = scrollProgress * 0.1;
        letter.rotation.x += Math.sin(time + i) * rotationSpeed;
        letter.rotation.y += Math.cos(time + i * 0.5) * rotationSpeed;
        letter.rotation.z += Math.sin(time * 0.5 + i * 0.2) * rotationSpeed;
      }
    });
  });

  // Memoize letter components
  const letterElements = useMemo(() => (
    Array.from({ length: letterCount }).map((_, i) => {
      const [x, y, z] = basePositions[i];
      const letter = letters[i % letters.length];
      const color = isDarkMode ? '#4F46E5' : '#9CA3AF';
      const scale = 0.8 + Math.sin(i * 1000) * 0.2;
      
      // Adjust scale for Arabic characters
      const isArabic = /[\u0600-\u06FF]/.test(letter);
      const fontSize = isArabic ? 0.45 : 0.5;

      return (
        <group 
          key={i} 
          position={[x, y, z]}
          ref={el => {
            if (el) lettersRef.current[i] = el;
          }}
        >
          <Text
            fontSize={fontSize * scale}
            color={color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Regular.woff"
            fontWeight="bold"
          >
            {letter}
          </Text>
        </group>
      );
    })
  ), [isDarkMode, basePositions]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Float
        speed={1}
        rotationIntensity={0.2 * (1 - scrollProgress)}
        floatIntensity={0.2 * (1 - scrollProgress)}
      >
        <group ref={groupRef}>
          {letterElements}
        </group>
      </Float>
    </>
  );
};

const LettersBackground = () => {
  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent to-white/5">
      <Canvas
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Scene />
        <Preload all />
      </Canvas>
    </div>
  );
};

export default LettersBackground; 