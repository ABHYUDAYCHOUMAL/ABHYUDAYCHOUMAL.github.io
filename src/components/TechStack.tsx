import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  BallCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechStack.css";

type Tech = { name: string; color: string; slug: string };

// `slug` is the simple-icons identifier used to fetch the SVG logo.
// See https://simpleicons.org for the master list.
const TECHS: Tech[] = [
  // Languages
  { name: "Python", color: "#3776AB", slug: "python" },
  { name: "TypeScript", color: "#3178C6", slug: "typescript" },
  { name: "JavaScript", color: "#F7DF1E", slug: "javascript" },
  { name: "Java", color: "#ED8B00", slug: "openjdk" },
  { name: "Swift", color: "#F05138", slug: "swift" },
  { name: "Solidity", color: "#363636", slug: "solidity" },
  // Frameworks
  { name: "FastAPI", color: "#009688", slug: "fastapi" },
  { name: "Node.js", color: "#339933", slug: "nodedotjs" },
  { name: "React", color: "#61DAFB", slug: "react" },
  { name: "Django", color: "#092E20", slug: "django" },
  { name: ".NET", color: "#512BD4", slug: "dotnet" },
  // Data
  { name: "MongoDB", color: "#47A248", slug: "mongodb" },
  { name: "MySQL", color: "#4479A1", slug: "mysql" },
  { name: "Redis", color: "#DC382D", slug: "redis" },
  { name: "Neo4j", color: "#018BFF", slug: "neo4j" },
  // Infrastructure
  { name: "Docker", color: "#2496ED", slug: "docker" },
  { name: "Git", color: "#F05032", slug: "git" },
  { name: "AWS", color: "#FF9900", slug: "amazonwebservices" },
  { name: "Firebase", color: "#FFCA28", slug: "firebase" },
  { name: "Android", color: "#3DDC84", slug: "android" },
];

/**
 * Generate a sphere texture with two side-by-side copies of the logo +
 * brand name on a white background.
 *
 * Why two copies? A Three.js SphereGeometry wraps a 2D texture
 * cylindrically — a single centered logo disappears from view when the
 * ball rotates 180°. Two copies 180° apart in texture space guarantee
 * at least one is visible on the front face no matter how the sphere
 * tumbles.
 */
function makeTechTexture(tech: Tech): THREE.Texture {
  // 1024×512 — wider than tall so the two-up layout has room
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  function paintBase() {
    // Pure white background — any warm tint will come from the HDR
    // environment lighting, not the texture
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    // Very subtle neutral vignette to add a hint of edge depth
    const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.55);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(20,20,30,0.06)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  function paintBrand(img: HTMLImageElement | null) {
    paintBase();

    const positions = [w * 0.25, w * 0.75];
    const logoCenterY = h * 0.42;
    const textY = h * 0.72;

    ctx.fillStyle = tech.color;
    ctx.font = "700 56px 'Space Grotesk', 'Inter', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const cx of positions) {
      if (img) {
        // Fit the logo into a target box while preserving its aspect ratio
        const target = h * 0.42;
        const nw = img.naturalWidth || img.width || 24;
        const nh = img.naturalHeight || img.height || 24;
        const scale = target / Math.max(nw, nh);
        const lw = nw * scale;
        const lh = nh * scale;
        ctx.drawImage(img, cx - lw / 2, logoCenterY - lh / 2, lw, lh);
        ctx.fillText(tech.name, cx, textY);
      } else {
        // No image — center the text vertically as the only branding
        ctx.fillText(tech.name, cx, h * 0.5);
      }
    }
  }

  paintBrand(null);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  // Async: load brand logo from simple-icons CDN, redraw with logo on load
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    paintBrand(img);
    texture.needsUpdate = true;
  };
  img.onerror = () => {
    // Network/CORS failure — text-only fallback already drawn
  };
  img.src = `https://cdn.simpleicons.org/${tech.slug}`;

  return texture;
}

const sphereGeometry = new THREE.SphereGeometry(1, 24, 24);

const SPHERE_COUNT = 16;
const SCALE_OPTIONS = [0.75, 0.9, 1.0, 1.1];

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
    // Gentle pull toward the scene origin. Smaller magnitudes than a
    // typical zero-gravity ball-pit so spheres drift into a calm
    // cluster instead of slamming into each other.
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(-15 * d * scale, -50 * d * scale, -15 * d * scale)
      );
    api.current.applyImpulse(impulse, true);
  });

  const r = THREE.MathUtils.randFloatSpread;
  return (
    <RigidBody
      linearDamping={0.92}
      angularDamping={0.4}
      friction={0.2}
      position={[r(30), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <mesh
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
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
      // MeshStandardMaterial is much lighter than PhysicalMaterial and
      // doesn't need an HDR environment to look convincing. Self-emission
      // through the texture keeps the spheres luminous; low metalness +
      // medium roughness gives a clean satin matte. ~40% less GPU work
      // per frame vs the physical/clearcoat path.
      return new THREE.MeshStandardMaterial({
        map: texture,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.32,
        metalness: 0.2,
        roughness: 0.55,
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
    <section className="techstack" id="techstack" ref={sectionRef}>
      <div className="techstack__stage">
        <Canvas
          gl={{ alpha: true, stencil: false, antialias: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          dpr={[1, 1.5]}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.4;
          }}
        >
            <ambientLight intensity={1} />
            <spotLight
              position={[20, 20, 25]}
              penumbra={1}
              angle={0.2}
              color="#ffffff"
              intensity={1}
            />
            <directionalLight position={[0, 5, -4]} intensity={2} />

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
          </Canvas>

          <div className="techstack__title-overlay">
            <span className="eyebrow">Tech stack</span>
            <h2 className="techstack__title">
              The tools I <em>reach for first.</em>
            </h2>
            <p className="techstack__lead">
              Hover the canvas — the balls react to your cursor.
            </p>
          </div>
        </div>

        <ul className="techstack__legend container">
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
    </section>
  );
};

export default TechStack;
