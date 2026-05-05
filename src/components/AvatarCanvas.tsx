import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { env } from "../data/site";

function buildOptimizedUrl(url: string): string {
  if (!url) return url;
  if (!url.includes("readyplayer.me")) return url;
  if (url.includes("?")) return url;
  return `${url}?meshLod=1&textureSizeLimit=1024&morphTargets=ARKit`;
}

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
    <group ref={group} position={[0, -1.45, 0]}>
      <primitive object={scene} scale={1.0} />
    </group>
  );
}

const AvatarCanvas = () => {
  const url = env.rpmAvatarUrl;
  const [hasGl, setHasGl] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setHasGl(
        !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
      );
    } catch {
      setHasGl(false);
    }
  }, []);

  if (!url || !hasGl) return null;

  return (
    <div className="avatar-canvas" aria-hidden>
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.05, 0.95], fov: 24 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[2.5, 3, 2]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-3, 1.5, 2]}
          intensity={0.45}
          color="#7dd3fc"
        />
        <pointLight position={[0.5, 1, 2]} intensity={0.5} color="#f4a261" />
        <Suspense fallback={null}>
          <AvatarModel url={buildOptimizedUrl(url)} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AvatarCanvas;
