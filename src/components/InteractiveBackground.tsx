import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '../store/themeStore';

const InteractiveBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();
  const { isDarkMode } = useThemeStore();

  // Memoize particle positions
  const particlePositions = useMemo(() => {
    const particlesCount = 2500; // Reduced count for better performance
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    return posArray;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Three.js scene with performance optimizations
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable antialiasing for better performance
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles with optimized geometry
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Optimize material settings
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.008,
      color: isDarkMode ? '#4fc3f7' : '#424242',
      transparent: true,
      opacity: isDarkMode ? 0.3 : 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false // Disable depth writing for better performance
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 2;

    // Throttled mouse move handler
    let lastMouseUpdate = 0;
    const mouseThrottleMs = 16; // Limit to ~60fps

    const onMouseMove = (event: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseUpdate < mouseThrottleMs) return;
      
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
      lastMouseUpdate = now;
    };

    // Debounced resize handler
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };

    // Optimized animation loop
    let lastRotationX = 0;
    let lastRotationY = 0;
    const rotationSpeed = 0.0003;
    const mouseInfluence = 0.03;
    const targetInfluence = 0.3;

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      // Calculate new rotations
      const targetRotationX = mousePosition.current.y * targetInfluence;
      const targetRotationY = mousePosition.current.x * targetInfluence;

      lastRotationX += (targetRotationX - lastRotationX) * mouseInfluence;
      lastRotationY += (targetRotationY - lastRotationY) * mouseInfluence;

      particlesMesh.rotation.x = lastRotationX + rotationSpeed;
      particlesMesh.rotation.y = lastRotationY + rotationSpeed;

      renderer.render(scene, camera);
    };

    // Add event listeners with passive option for better performance
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    animate();

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [isDarkMode, particlePositions]);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform' // Optimize for animations
      }}
    />
  );
};

export default InteractiveBackground; 