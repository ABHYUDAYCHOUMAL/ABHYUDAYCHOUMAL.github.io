import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { env } from "../data/site";
import "./styles/Avatar.css";

// Ready Player Me serves halfbody/fullbody .glb avatars at:
// https://models.readyplayer.me/<id>.glb
// Append query params to optimize — RPM-specific, skip for local files.
function buildOptimizedUrl(url: string): string {
  if (!url) return url;
  if (!url.includes("readyplayer.me")) return url;
  if (url.includes("?")) return url;
  return `${url}?meshLod=1&textureSizeLimit=1024&morphTargets=ARKit`;
}

function AvatarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      target.current = { x: x * 0.25, y: y * 0.15 };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    // Smooth head/body tracking toward cursor
    const lerp = Math.min(1, delta * 4);
    ref.current.rotation.y +=
      (target.current.x - ref.current.rotation.y) * lerp;
    ref.current.rotation.x +=
      (target.current.y * 0.4 - ref.current.rotation.x) * lerp;
  });

  return (
    <group ref={ref} position={[0, -1.6, 0]}>
      <primitive object={scene} scale={1.1} />
    </group>
  );
}

const Avatar = () => {
  const [hasGl, setHasGl] = useState(true);
  const url = env.rpmAvatarUrl;

  useEffect(() => {
    // Quick WebGL availability check — gracefully bail on unsupported devices
    try {
      const canvas = document.createElement("canvas");
      const ok = !!(
        canvas.getContext("webgl2") || canvas.getContext("webgl")
      );
      setHasGl(ok);
    } catch {
      setHasGl(false);
    }
  }, []);

  if (!url || !hasGl) {
    return null;
  }

  return (
    <section className="avatar section" id="avatar">
      <div className="container avatar__inner">
        <header className="avatar__header">
          <span className="eyebrow">In person (sort of)</span>
          <h2 className="section-title">
            Hey — <em>I'm Abhyuday.</em>
          </h2>
          <p className="avatar__lead">
            Move your cursor around. The avatar will follow.
          </p>
        </header>

        <div className="avatar__canvas-wrap" aria-hidden>
          <Canvas
            shadows
            camera={{ position: [0, 0.2, 2.4], fov: 30 }}
            dpr={[1, 1.6]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.45} />
            <directionalLight
              position={[2.5, 3, 2]}
              intensity={1.1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-3, 1.5, 2]} intensity={0.4} color="#7dd3fc" />
            <pointLight position={[0, 1, 3]} intensity={0.4} color="#f4a261" />

            <Suspense fallback={null}>
              <AvatarModel url={buildOptimizedUrl(url)} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default Avatar;
