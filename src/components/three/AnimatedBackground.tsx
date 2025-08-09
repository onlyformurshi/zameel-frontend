import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Mesh, Group } from 'three';
import { useThemeStore } from '../../store/themeStore';

function TransformingModel() {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const prevScrollRef = useRef(0);
  const { viewport } = useThree();
  const { isDarkMode } = useThemeStore();

  // Create geometries for different stages
  const geometries = useMemo(() => {
    // Create a detailed pencil geometry
    const createPencil = () => {
      // Create hexagonal body
      const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.15, 3, 6);
      
      // Create pencil tip (cone)
      const tipGeometry = new THREE.CylinderGeometry(0, 0.15, 0.6, 6);
      const tipMatrix = new THREE.Matrix4().makeTranslation(0, -1.8, 0);
      tipGeometry.applyMatrix4(tipMatrix);
      
      // Create eraser (cylinder with pink color)
      const eraserBaseGeometry = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 6);
      const eraserTopGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 6);
      
      // Position eraser parts
      const eraserBaseMatrix = new THREE.Matrix4().makeTranslation(0, 1.55, 0);
      const eraserTopMatrix = new THREE.Matrix4().makeTranslation(0, 1.7, 0);
      eraserBaseGeometry.applyMatrix4(eraserBaseMatrix);
      eraserTopGeometry.applyMatrix4(eraserTopMatrix);
      
      // Create wood color band near eraser
      const bandGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 6);
      const bandMatrix = new THREE.Matrix4().makeTranslation(0, 1.45, 0);
      bandGeometry.applyMatrix4(bandMatrix);
      
      // Merge all geometries
      const geometries = [
        bodyGeometry,
        tipGeometry,
        eraserBaseGeometry,
        eraserTopGeometry,
        bandGeometry
      ];
      
      // Merge geometries
      const mergedGeometry = mergeBufferGeometries(geometries);
      return mergedGeometry;
    };

    // Create a book geometry
    const createBook = () => {
      const geometry = new THREE.BufferGeometry();
      
      // Book dimensions
      const width = 3;
      const height = 4;
      const depth = 0.4;
      const pageDepth = 0.35;
      
      const vertices = new Float32Array([
        // Front cover
        -width/2, -height/2, depth/2,
        width/2, -height/2, depth/2,
        width/2, height/2, depth/2,
        -width/2, height/2, depth/2,
        
        // Back cover
        -width/2, -height/2, -depth/2,
        width/2, -height/2, -depth/2,
        width/2, height/2, -depth/2,
        -width/2, height/2, -depth/2,
        
        // Pages (slightly smaller than covers)
        -width/2 + 0.1, -height/2 + 0.1, pageDepth/2,
        width/2 - 0.1, -height/2 + 0.1, pageDepth/2,
        width/2 - 0.1, height/2 - 0.1, pageDepth/2,
        -width/2 + 0.1, height/2 - 0.1, pageDepth/2,
        
        // Spine curve
        -width/2, -height/2, depth/2,
        -width/2, -height/2, -depth/2,
        -width/2, height/2, -depth/2,
        -width/2, height/2, depth/2,
      ]);
      
      const indices = new Uint16Array([
        // Front cover
        0, 1, 2, 0, 2, 3,
        // Back cover
        4, 5, 6, 4, 6, 7,
        // Pages
        8, 9, 10, 8, 10, 11,
        // Spine
        12, 13, 14, 12, 14, 15,
      ]);
      
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.computeVertexNormals();
      
      return geometry;
    };

    // Helper function to merge geometries
    function mergeBufferGeometries(geometries: THREE.BufferGeometry[]) {
      let vertexCount = 0;
      let indexCount = 0;
      
      // Calculate total counts
      geometries.forEach((geo: THREE.BufferGeometry) => {
        vertexCount += geo.attributes.position.count;
        if (geo.index) indexCount += geo.index.count;
      });
      
      // Create merged arrays
      const mergedVertices = new Float32Array(vertexCount * 3);
      const mergedIndices = new Uint16Array(indexCount);
      
      let vertexOffset = 0;
      let indexOffset = 0;
      
      // Merge geometries
      geometries.forEach((geo: THREE.BufferGeometry) => {
        mergedVertices.set(geo.attributes.position.array, vertexOffset * 3);
        
        if (geo.index) {
          const indices = geo.index.array;
          for (let i = 0; i < indices.length; i++) {
            mergedIndices[indexOffset + i] = indices[i] + vertexOffset;
          }
          indexOffset += indices.length;
        }
        
        vertexOffset += geo.attributes.position.count;
      });
      
      // Create merged geometry
      const mergedGeometry = new THREE.BufferGeometry();
      mergedGeometry.setAttribute('position', new THREE.BufferAttribute(mergedVertices, 3));
      mergedGeometry.setIndex(new THREE.BufferAttribute(mergedIndices, 1));
      mergedGeometry.computeVertexNormals();
      
      return mergedGeometry;
    }

    return {
      pencil: createPencil(),
      book: createBook()
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const scroll = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scroll / totalHeight, 1);
    
    // Determine scroll direction
    const isScrollingDown = scroll > prevScrollRef.current;
    prevScrollRef.current = scroll;

    // Position animation based on scroll
    const targetX = THREE.MathUtils.lerp(0, viewport.width * 0.3, scrollProgress);
    const targetY = THREE.MathUtils.lerp(0, -viewport.height * 0.3, scrollProgress);
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);

    // Rotation animation
    groupRef.current.rotation.x = time * 0.2;
    groupRef.current.rotation.y = time * 0.3;

    // Scale animation based on scroll (moderate size)
    const scale = THREE.MathUtils.lerp(1, 0.8, scrollProgress);
    groupRef.current.scale.setScalar(scale);

    // Morph between pencil and book based on scroll direction
    const positions = meshRef.current.geometry.attributes.position;
    const targetGeometry = scrollProgress < 0.5 ? geometries.pencil : geometries.book;
    const phase = scrollProgress < 0.5 ? scrollProgress * 2 : (scrollProgress - 0.5) * 2;

    const targetPositions = targetGeometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3;
      const targetI3 = (i % targetPositions.count) * 3;

      // Adjust morphing speed based on scroll direction
      const morphSpeed = isScrollingDown ? 0.1 : 0.15;

      positions.array[i3] = THREE.MathUtils.lerp(
        positions.array[i3],
        targetPositions.array[targetI3],
        phase * morphSpeed
      );
      positions.array[i3 + 1] = THREE.MathUtils.lerp(
        positions.array[i3 + 1],
        targetPositions.array[targetI3 + 1],
        phase * morphSpeed
      );
      positions.array[i3 + 2] = THREE.MathUtils.lerp(
        positions.array[i3 + 2],
        targetPositions.array[targetI3 + 2],
        phase * morphSpeed
      );
    }

    positions.needsUpdate = true;

    // Add gentle floating animation
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3;
      positions.array[i3 + 1] += Math.sin(time * 2 + positions.array[i3] * 0.5) * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometries.pencil.attributes.position.count}
            array={geometries.pencil.attributes.position.array}
            itemSize={3}
          />
        </bufferGeometry>
        <meshStandardMaterial
          color={isDarkMode ? "#6366f1" : "#374151"}
          wireframe={true}
          emissive={isDarkMode ? "#818cf8" : "#4B5563"}
          emissiveIntensity={isDarkMode ? 0.5 : 0.8}
          opacity={0.8}
          transparent={true}
        />
      </mesh>

      {/* Floating particles */}
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={150}
            array={new Float32Array(450).map(() => (Math.random() - 0.5) * 3)}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          color={isDarkMode ? "#818cf8" : "#374151"}
          opacity={isDarkMode ? 0.6 : 0.8}
        />
      </Points>
    </group>
  );
}

function BackgroundStars({ count = 1000 }) {
  const positions = useMemo(() => {
    return new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 50);
  }, [count]);

  return (
    <Points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.01}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#818cf8"
        transparent
        opacity={0.5}
      />
    </Points>
  );
}

export default function AnimatedBackground() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
      
      <TransformingModel />
      <BackgroundStars />
      
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#000"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
    </>
  );
} 