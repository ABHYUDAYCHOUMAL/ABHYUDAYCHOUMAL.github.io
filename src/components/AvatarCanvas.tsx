import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "./styles/AvatarCanvas.css";

// Drei's GLTF loader uses the Draco WASM decoder shipped in /public/draco
// so it can transparently load Draco-compressed GLBs.
useGLTF.setDecoderPath("/draco/");

const MODEL_URL = "/avatar.glb";

function AvatarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      target.current = { x: x * 0.28, y: y * 0.18 };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_state, delta) => {
    if (!group.current) return;
    const lerp = Math.min(1, delta * 4);
    group.current.rotation.y +=
      (target.current.x - group.current.rotation.y) * lerp;
    group.current.rotation.x +=
      (target.current.y * 0.4 - group.current.rotation.x) * lerp;
  });

  return (
    <group ref={group} position={[0, -1.5, 0]}>
      <primitive object={scene} scale={1.15} />
    </group>
  );
}

const AvatarCanvas = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hasGl, setHasGl] = useState(true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setHasGl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setHasGl(false);
    }
  }, []);

  // Pause rendering once the user has scrolled past the hero. Saves a
  // continuous WebGL render loop that would otherwise keep ticking
  // through every other section.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!hasGl) return null;

  return (
    <div className="avatar-canvas" aria-hidden ref={wrapRef}>
      <Canvas
        frameloop={inView ? "always" : "demand"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.45, 1.85], fov: 14, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl, camera }) => {
          gl.toneMappingExposure = 1.1;
          camera.lookAt(0, 0.42, 0);
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2.5, 3, 2]} intensity={1.2} />
        <directionalLight
          position={[-3, 1.5, 2]}
          intensity={0.45}
          color="#7dd3fc"
        />
        <pointLight position={[0.5, 1, 2]} intensity={0.5} color="#f4a261" />
        <Suspense fallback={null}>
          <AvatarModel url={MODEL_URL} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AvatarCanvas;
