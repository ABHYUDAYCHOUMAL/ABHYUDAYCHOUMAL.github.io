import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechStack.css";

type Tech = { name: string; color: string };

const TECHS: Tech[] = [
  { name: "Python", color: "#3776AB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "FastAPI", color: "#009688" },
  { name: "Node.js", color: "#339933" },
  { name: "React", color: "#61DAFB" },
  { name: "Docker", color: "#2496ED" },
  { name: "Redis", color: "#DC382D" },
  { name: "Neo4j", color: "#018BFF" },
  { name: "MongoDB", color: "#47A248" },
  { name: "AWS", color: "#FF9900" },
  { name: "Swift", color: "#F05138" },
  { name: ".NET", color: "#512BD4" },
];

/** Generate a circular Three texture with the tech name + colored fill. */
function makeTechTexture(tech: Tech): THREE.Texture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Background — radial gradient with tech color
  const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.55);
  grad.addColorStop(0, lighten(tech.color, 18));
  grad.addColorStop(1, tech.color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Subtle vignette
  const vignette = ctx.createRadialGradient(size / 2, size / 2, size * 0.4, size / 2, size / 2, size * 0.7);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, size, size);

  // Tech name label
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = "600 64px 'Space Grotesk', 'Inter', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(tech.name, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function lighten(hex: string, amount: number): string {
  const c = hex.replace("#", "");
  const r = Math.min(255, parseInt(c.slice(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(c.slice(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(c.slice(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const SPHERE_COUNT = 24;
const SCALE_OPTIONS = [0.7, 0.85, 1.0, 1.1];

function pickScale(): number {
  return SCALE_OPTIONS[Math.floor(Math.random() * SCALE_OPTIONS.length)];
}

type SphereProps = {
  scale: number;
  material: THREE.Material;
  isActive: boolean;
};

function Sphere({ scale, material, isActive }: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    const d = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiplyScalar(-1)
      .multiply(new THREE.Vector3(40 * d * scale, 90 * d * scale, 40 * d * scale));
    api.current.applyImpulse(impulse, true);
  });

  const r = THREE.MathUtils.randFloatSpread;
  return (
    <RigidBody
      linearDamping={0.7}
      angularDamping={0.2}
      friction={0.2}
      position={[r(20), r(20) - 5, r(20) - 8]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
      />
    </RigidBody>
  );
}

type PointerProps = { isActive: boolean };

function Pointer({ isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody | null>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    const target = vec.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );
    ref.current.setNextKinematicTranslation(target);
  });

  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      position={[100, 100, 100]}
      colliders={false}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const materials = useMemo(() => {
    return TECHS.map((tech) => {
      const texture = makeTechTexture(tech);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: 0.4,
        roughness: 0.45,
        clearcoat: 0.35,
        clearcoatRoughness: 0.4,
        emissive: new THREE.Color(tech.color),
        emissiveMap: texture,
        emissiveIntensity: 0.18,
      });
    });
  }, []);

  const spheres = useMemo(
    () =>
      Array.from({ length: SPHERE_COUNT }, (_, i) => ({
        scale: pickScale(),
        material: materials[i % materials.length],
      })),
    [materials]
  );

  return (
    <section className="techstack section" id="techstack" ref={sectionRef}>
      <div className="container techstack__inner">
        <header className="techstack__header">
          <span className="eyebrow">Tech stack</span>
          <h2 className="section-title">
            The tools I <em>reach for first.</em>
          </h2>
          <p className="techstack__lead">
            Hover the canvas — the balls react to your cursor. Everything you
            see is a tool I've shipped real production code with.
          </p>
        </header>

        <div className="techstack__canvas-wrap" aria-hidden>
          <Canvas
            shadows
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 0, 20], fov: 32, near: 1, far: 100 }}
            dpr={[1, 1.6]}
          >
            <ambientLight intensity={0.7} />
            <spotLight
              position={[20, 18, 22]}
              penumbra={1}
              angle={0.3}
              color="#ffffff"
              intensity={1.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-8, -4, 10]} intensity={0.6} color="#7dd3fc" />
            <directionalLight position={[8, -2, -6]} intensity={0.35} color="#f4a261" />

            <Physics gravity={[0, 0, 0]}>
              <Pointer isActive={isActive} />
              {spheres.map((s, i) => (
                <Sphere
                  key={i}
                  scale={s.scale}
                  material={s.material}
                  isActive={isActive}
                />
              ))}
            </Physics>

            <EffectComposer enableNormalPass={false}>
              <N8AO color="#0c1018" aoRadius={2} intensity={0.9} />
            </EffectComposer>
          </Canvas>
        </div>

        <ul className="techstack__legend">
          {TECHS.map((t) => (
            <li key={t.name}>
              <span
                className="techstack__dot"
                style={{ background: t.color }}
                aria-hidden
              />
              {t.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TechStack;
