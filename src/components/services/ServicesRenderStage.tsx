"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BackSide,
  CanvasTexture,
  Color,
  Mesh,
  Object3D,
  PMREMGenerator,
  RepeatWrapping,
  Scene as ThreeScene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  type Group,
  type InstancedMesh,
  type MeshStandardMaterial,
  type Texture,
} from "three";

export type RenderKind = "exterior" | "interior" | "aerial" | "plan" | "amenity";

type Vec3 = [number, number, number];

/* Deterministic random so scenes look the same on every visit. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

/* ---------- Shared pieces ---------- */

function useFacade(cols: number, rows: number, seed: number, lit: number) {
  const textures = useMemo(() => {
    const cw = 16;
    const rh = 20;
    const base = document.createElement("canvas");
    const glow = document.createElement("canvas");
    base.width = glow.width = cols * cw;
    base.height = glow.height = rows * rh;
    const g = base.getContext("2d");
    const ge = glow.getContext("2d");
    if (!g || !ge) return null;

    const rand = seeded(seed);
    g.fillStyle = "#f4efe6";
    g.fillRect(0, 0, base.width, base.height);
    ge.fillStyle = "#000000";
    ge.fillRect(0, 0, glow.width, glow.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const on = rand() < lit;
        const wx = x * cw + 2;
        const wy = y * rh + 4;
        if (on) {
          g.fillStyle = "#ffd890";
        } else {
          const sky = g.createLinearGradient(wx, wy, wx, wy + rh - 7);
          sky.addColorStop(0, "#a9c2d8");
          sky.addColorStop(1, rand() < 0.5 ? "#6f8eab" : "#5f7f9e");
          g.fillStyle = sky;
        }
        g.fillRect(wx, wy, cw - 4, rh - 7);
        if (on) {
          ge.fillStyle = "#ffb85a";
          ge.fillRect(wx, wy, cw - 4, rh - 7);
        }
      }
      g.fillStyle = "#ddd5c7";
      g.fillRect(0, y * rh, base.width, 2);
    }

    const map = new CanvasTexture(base);
    const emissive = new CanvasTexture(glow);
    map.colorSpace = SRGBColorSpace;
    emissive.colorSpace = SRGBColorSpace;
    return { map, emissive };
  }, [cols, rows, seed, lit]);

  useEffect(
    () => () => {
      textures?.map.dispose();
      textures?.emissive.dispose();
    },
    [textures],
  );

  return textures;
}

const FLOOR = 0.32;

function Tower({
  position,
  w = 2,
  d = 2,
  floors = 12,
  seed = 1,
  lit = 0.3,
  glow = 0.6,
}: {
  position: Vec3;
  w?: number;
  d?: number;
  floors?: number;
  seed?: number;
  lit?: number;
  glow?: number;
}) {
  const facade = useFacade(Math.max(3, Math.round(w * 4)), floors, seed, lit);
  const h = floors * FLOOR;

  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        {[0, 1, 4, 5].map((i) => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            map={facade?.map ?? null}
            emissiveMap={facade?.emissive ?? null}
            emissive="#ffffff"
            emissiveIntensity={glow}
            roughness={0.5}
            metalness={0.08}
          />
        ))}
        <meshStandardMaterial attach="material-2" color="#d3cbbd" />
        <meshStandardMaterial attach="material-3" color="#d3cbbd" />
      </mesh>
      {Array.from({ length: Math.floor(floors / 3) }, (_, i) => (
        <mesh key={i} position={[0, (i * 3 + 3) * FLOOR, d / 2 + 0.09]} castShadow>
          <boxGeometry args={[w * 0.92, 0.05, 0.18]} />
          <meshStandardMaterial color="#f6f2ea" />
        </mesh>
      ))}
      <mesh position={[0, h + 0.16, 0]} castShadow>
        <boxGeometry args={[w * 0.62, 0.32, d * 0.62]} />
        <meshStandardMaterial color="#ddd5c6" />
      </mesh>
    </group>
  );
}

function Tree({ position, s = 1, color = "#4f7d3a" }: { position: Vec3; s?: number; color?: string }) {
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#6b4a2f" />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}

function Palm({ position, s = 1, lean = 0.12 }: { position: Vec3; s?: number; lean?: number }) {
  return (
    <group position={position} scale={s} rotation={[0, 0, lean]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 1.8, 7]} />
        <meshStandardMaterial color="#8a6a45" />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 1.82, 0]}
          rotation={[0.55, (i / 7) * Math.PI * 2, 0]}
          castShadow
        >
          <boxGeometry args={[0.16, 0.02, 0.9]} />
          <meshStandardMaterial color="#3f7a3c" />
        </mesh>
      ))}
    </group>
  );
}

function Sun({
  position,
  intensity = 2,
  color = "#fff1d6",
  size = 14,
  mapSize = 1024,
}: {
  position: Vec3;
  intensity?: number;
  color?: string;
  size?: number;
  mapSize?: number;
}) {
  return (
    <directionalLight
      position={position}
      intensity={intensity}
      color={color}
      castShadow
      shadow-mapSize={[mapSize, mapSize]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.02}
      shadow-camera-left={-size}
      shadow-camera-right={size}
      shadow-camera-top={size}
      shadow-camera-bottom={-size}
      shadow-camera-far={80}
    />
  );
}

function Orbit({
  radius,
  height,
  target,
  speed,
  start = 0,
  reduced,
}: {
  radius: number;
  height: number;
  target: Vec3;
  speed: number;
  start?: number;
  reduced: boolean;
}) {
  const angle = useRef(start);
  useFrame((state, delta) => {
    if (!reduced) angle.current += Math.min(delta, 0.05) * speed;
    const a = angle.current;
    state.camera.position.set(
      target[0] + Math.cos(a) * radius,
      height,
      target[2] + Math.sin(a) * radius,
    );
    state.camera.lookAt(target[0], target[1], target[2]);
  });
  return null;
}

/* ---------- Scenes ---------- */

/* ---------- Photoreal exterior ---------- */

const SKY = {
  top: "#3a78cf",
  horizon: "#ffd2a0",
  ground: "#6d6450",
  sun: "#ffc27a",
};
const SUN_POS: Vec3 = [16, 7.5, 9];
const HAZE = "#f3d2ae";

function canvas2d(w: number, h: number) {
  const el = document.createElement("canvas");
  el.width = w;
  el.height = h;
  return [el, el.getContext("2d") as CanvasRenderingContext2D] as const;
}

function toTexture(el: HTMLCanvasElement, srgb: boolean, repeat?: [number, number]) {
  const tex = new CanvasTexture(el);
  if (srgb) tex.colorSpace = SRGBColorSpace;
  if (repeat) {
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  /* The renderer clamps this to what the GPU supports. */
  tex.anisotropy = 8;
  return tex;
}

function useDisposeTextures(textures: Record<string, Texture>) {
  useEffect(() => () => Object.values(textures).forEach((tex) => tex.dispose()), [textures]);
}

type FacadeOpts = {
  bays: number;
  floors: number;
  seed: number;
  lit: number;
  stone?: number[];
  slab?: number;
};

/* Colour, glow and a packed roughness (G) / metalness (B) map for a glass
   curtain-wall facade: concrete floor bands, aluminium mullions, sky
   reflections and a few warm rooms. */
function drawFacade({ bays, floors, seed, lit, stone = [], slab = 0.17 }: FacadeOpts) {
  const BW = 64;
  const FP = 48;
  const W = bays * BW;
  const H = floors * FP;
  const [base, g] = canvas2d(W, H);
  const [glow, e] = canvas2d(W, H);
  const [orm, o] = canvas2d(W, H);
  const rand = seeded(seed);

  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#bcd2e4");
  sky.addColorStop(0.5, "#86a3bb");
  sky.addColorStop(1, "#506778");
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 7; i++) {
    const x = rand() * W * 1.6 - W * 0.2;
    const bw = W * (0.05 + rand() * 0.16);
    g.fillStyle = i % 3 === 0 ? "rgba(20, 32, 46, 0.14)" : "rgba(255, 246, 232, 0.16)";
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x + bw, 0);
    g.lineTo(x + bw - H * 0.55, H);
    g.lineTo(x - H * 0.55, H);
    g.fill();
  }

  e.fillStyle = "#000000";
  e.fillRect(0, 0, W, H);
  o.fillStyle = "rgb(0, 18, 150)";
  o.fillRect(0, 0, W, H);

  const slabH = Math.round(FP * slab);
  for (let y = 0; y < floors; y++) {
    for (let x = 0; x < bays; x++) {
      const px = x * BW;
      const py = y * FP;

      if (stone.includes(x)) {
        g.fillStyle = "#d9c7a9";
        g.fillRect(px, py, BW, FP);
        g.fillStyle = "#c2ad8c";
        g.fillRect(px, py + FP - 2, BW, 2);
        o.fillStyle = "rgb(0, 235, 0)";
        o.fillRect(px, py, BW, FP);
        continue;
      }

      const gy = py + slabH;
      const gh = FP - slabH;
      const r = rand();
      if (r < lit) {
        const warm = g.createLinearGradient(0, gy, 0, gy + gh);
        warm.addColorStop(0, "#f1dfbf");
        warm.addColorStop(1, "#b98c5e");
        g.fillStyle = warm;
        g.fillRect(px, gy, BW, gh);
        e.fillStyle = "#ffb25c";
        e.fillRect(px, gy, BW, gh);
        o.fillStyle = "rgb(0, 40, 20)";
        o.fillRect(px, gy, BW, gh);
        if (rand() < 0.65) {
          const cw = 8 + rand() * 12;
          g.fillStyle = "#efe1c6";
          g.fillRect(px + 3, gy, cw, gh);
          g.fillRect(px + BW - 3 - cw * 0.7, gy, cw * 0.7, gh);
          e.fillStyle = "#6a4423";
          e.fillRect(px + 3, gy, cw, gh);
          e.fillRect(px + BW - 3 - cw * 0.7, gy, cw * 0.7, gh);
        }
      } else if (r < lit + 0.3) {
        g.fillStyle = "rgba(38, 30, 26, 0.32)";
        g.fillRect(px, gy, BW, gh);
        if (rand() < 0.5) {
          g.fillStyle = "rgba(236, 226, 206, 0.4)";
          g.fillRect(px + 3, gy, 10 + rand() * 14, gh);
        }
      }

      g.fillStyle = "#2c3136";
      g.fillRect(px, gy, 3, gh);
      g.fillRect(px + BW - 3, gy, 3, gh);
      g.fillRect(px + BW / 2 - 1, gy, 2, gh);
      g.fillRect(px, gy + Math.round(gh * 0.74), BW, 2);
      o.fillStyle = "rgb(0, 90, 220)";
      o.fillRect(px, gy, 3, gh);
      o.fillRect(px + BW - 3, gy, 3, gh);
      o.fillRect(px + BW / 2 - 1, gy, 2, gh);

      g.fillStyle = "#ece7de";
      g.fillRect(px, py, BW, slabH);
      g.fillStyle = "#b5ad9f";
      g.fillRect(px, py + slabH - 2, BW, 2);
      o.fillStyle = "rgb(0, 215, 0)";
      o.fillRect(px, py, BW, slabH);
    }
  }

  return {
    map: toTexture(base, true),
    emissive: toTexture(glow, true),
    orm: toTexture(orm, false),
  };
}

function useFacadeSet(front: FacadeOpts, side: FacadeOpts) {
  const key = JSON.stringify([front, side]);
  const textures = useMemo(() => {
    const [f, s] = (JSON.parse(key) as [FacadeOpts, FacadeOpts]).map(drawFacade);
    return {
      fMap: f.map,
      fGlow: f.emissive,
      fOrm: f.orm,
      sMap: s.map,
      sGlow: s.emissive,
      sOrm: s.orm,
    };
  }, [key]);
  useDisposeTextures(textures);
  return textures;
}

type Item = { p: Vec3; s: Vec3; r?: number; c?: string };

/* One draw call for many copies of the same mesh. */
function Instances({
  items,
  shadows = true,
  children,
}: {
  items: Item[];
  shadows?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    const color = new Color();
    items.forEach((item, i) => {
      dummy.position.set(...item.p);
      dummy.scale.set(...item.s);
      dummy.rotation.set(0, item.r ?? 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (item.c) mesh.setColorAt(i, color.set(item.c));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, items.length]}
      castShadow={shadows}
      receiveShadow
    >
      {children}
    </instancedMesh>
  );
}

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = pos.xyww;
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = h > 0.0
      ? mix(uHorizon, uTop, pow(h, 0.38))
      : mix(uHorizon, uGround, pow(min(-h * 5.0, 1.0), 0.7));
    float s = max(dot(d, normalize(uSunDir)), 0.0);
    col += uSun * (pow(s, 900.0) * 6.0 + pow(s, 24.0) * 0.45 + pow(s, 4.0) * 0.12);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function skyMaterial() {
  return new ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new Color(SKY.top) },
      uHorizon: { value: new Color(SKY.horizon) },
      uGround: { value: new Color(SKY.ground) },
      uSun: { value: new Color(SKY.sun) },
      uSunDir: { value: new Vector3(...SUN_POS).normalize() },
    },
  });
}

/* Golden-hour sky dome, also baked into an environment map so glass and
   metal reflect the same sky the camera sees. */
function GoldenSky() {
  const gl = useThree((s) => s.gl);
  const get = useThree((s) => s.get);
  const material = useMemo(() => skyMaterial(), []);

  useEffect(() => {
    const scene = get().scene;
    const pmrem = new PMREMGenerator(gl);
    const envScene = new ThreeScene();
    const envMat = skyMaterial();
    const envGeo = new SphereGeometry(40, 48, 24);
    envScene.add(new Mesh(envGeo, envMat));
    const env = pmrem.fromScene(envScene, 0.02).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.75;
    return () => {
      scene.environment = null;
      env.dispose();
      envGeo.dispose();
      envMat.dispose();
      pmrem.dispose();
    };
  }, [gl, get]);

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh material={material} frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[150, 48, 24]} />
    </mesh>
  );
}

const TOWER_FH = 0.3;

function GlassTower({
  position,
  w,
  d,
  floors,
  seed,
  lit = 0.14,
  rotation = 0,
}: {
  position: Vec3;
  w: number;
  d: number;
  floors: number;
  seed: number;
  lit?: number;
  rotation?: number;
}) {
  const bays = 2 * Math.max(2, Math.round(w / 0.8));
  const sideBays = Math.max(4, Math.round(d / 0.4));
  const spineA = Math.floor(bays / 2) - 1;
  const tex = useFacadeSet(
    { bays, floors, seed, lit, stone: [spineA, spineA + 1] },
    { bays: sideBays, floors, seed: seed + 101, lit },
  );
  const h = floors * TOWER_FH;
  const bayW = w / bays;

  const slabs = useMemo<Item[]>(
    () =>
      Array.from({ length: floors }, (_, i) => ({
        p: [0, (i + 1) * TOWER_FH - 0.025, 0],
        s: [w + 0.05, 0.05, d + 0.05],
      })),
    [floors, w, d],
  );

  const balconies = useMemo(() => {
    const spanW = (spineA * bayW) * 0.94;
    const cx = w / 2 - (spineA * bayW) / 2;
    const deck: Item[] = [];
    const glass: Item[] = [];
    const rail: Item[] = [];
    for (let i = 1; i < floors; i++) {
      const y = i * TOWER_FH;
      for (const side of [1, -1]) {
        for (const sx of [-cx, cx]) {
          const z = side * (d / 2 + 0.17);
          deck.push({ p: [sx, y - 0.02, z], s: [spanW, 0.04, 0.34] });
          glass.push({ p: [sx, y + 0.06, side * (d / 2 + 0.335)], s: [spanW, 0.12, 0.01] });
          rail.push({ p: [sx, y + 0.125, side * (d / 2 + 0.335)], s: [spanW, 0.012, 0.022] });
        }
      }
    }
    return { deck, glass, rail };
  }, [floors, w, d, bayW, spineA]);

  const spineX = (spineA + 1) * bayW - w / 2;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        {[0, 1, 4, 5].map((i) => {
          const front = i >= 4;
          return (
            <meshStandardMaterial
              key={i}
              attach={`material-${i}`}
              map={front ? tex.fMap : tex.sMap}
              emissiveMap={front ? tex.fGlow : tex.sGlow}
              roughnessMap={front ? tex.fOrm : tex.sOrm}
              metalnessMap={front ? tex.fOrm : tex.sOrm}
              emissive="#ffffff"
              emissiveIntensity={0.35}
              roughness={1}
              metalness={1}
            />
          );
        })}
        <meshStandardMaterial attach="material-2" color="#cfc8bb" roughness={0.9} />
        <meshStandardMaterial attach="material-3" color="#cfc8bb" roughness={0.9} />
      </mesh>

      <Instances items={slabs}>
        <boxGeometry />
        <meshStandardMaterial color="#efeae1" roughness={0.85} />
      </Instances>
      <Instances items={balconies.deck}>
        <boxGeometry />
        <meshStandardMaterial color="#e9e3d8" roughness={0.8} />
      </Instances>
      <Instances items={balconies.rail} shadows={false}>
        <boxGeometry />
        <meshStandardMaterial color="#3a3e43" roughness={0.35} metalness={0.8} />
      </Instances>
      <Instances items={balconies.glass} shadows={false}>
        <boxGeometry />
        <meshPhysicalMaterial
          color="#d6e8f0"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          depthWrite={false}
        />
      </Instances>

      {/* stone spine rising past the roof */}
      <mesh position={[spineX, (h + 0.75) / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[bayW * 2, h + 0.75, d + 0.12]} />
        <meshStandardMaterial color="#d8c5a5" roughness={0.75} />
      </mesh>
      {Array.from({ length: Math.floor(floors / 2) }, (_, i) => (
        <mesh key={i} position={[spineX, (i * 2 + 2) * TOWER_FH, 0]}>
          <boxGeometry args={[bayW * 2 + 0.01, 0.012, d + 0.13]} />
          <meshStandardMaterial color="#bba584" roughness={0.8} />
        </mesh>
      ))}

      {/* parapet, rooftop plant room and crown frame */}
      {[
        [0, d / 2, w + 0.06, 0.06],
        [0, -d / 2, w + 0.06, 0.06],
        [w / 2, 0, 0.06, d],
        [-w / 2, 0, 0.06, d],
      ].map(([x, z, sx, sz]) => (
        <mesh key={`${x}${z}`} position={[x, h + 0.1, z]} castShadow>
          <boxGeometry args={[sx, 0.2, sz]} />
          <meshStandardMaterial color="#e7e1d6" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[-w * 0.18, h + 0.24, -d * 0.12]} castShadow>
        <boxGeometry args={[w * 0.4, 0.48, d * 0.45]} />
        <meshStandardMaterial color="#d2cbbf" roughness={0.9} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[w * 0.12 + i * 0.12, h + 0.32, 0]} castShadow>
          <boxGeometry args={[0.03, 0.64, d * 0.8]} />
          <meshStandardMaterial color="#3a3e43" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Podium({ w, d, h, position }: { w: number; d: number; h: number; position: Vec3 }) {
  const bays = Math.round(w / 0.6);
  const sideBays = Math.round(d / 0.6);
  const stone = (n: number) => Array.from({ length: n }, (_, i) => i).filter((i) => i % 4 === 0);
  const tex = useFacadeSet(
    { bays, floors: 2, seed: 77, lit: 0.9, stone: stone(bays), slab: 0.24 },
    { bays: sideBays, floors: 2, seed: 78, lit: 0.7, stone: stone(sideBays), slab: 0.24 },
  );
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        {[0, 1, 4, 5].map((i) => {
          const front = i >= 4;
          return (
            <meshStandardMaterial
              key={i}
              attach={`material-${i}`}
              map={front ? tex.fMap : tex.sMap}
              emissiveMap={front ? tex.fGlow : tex.sGlow}
              roughnessMap={front ? tex.fOrm : tex.sOrm}
              metalnessMap={front ? tex.fOrm : tex.sOrm}
              emissive="#ffffff"
              emissiveIntensity={0.8}
              roughness={1}
              metalness={1}
            />
          );
        })}
        <meshStandardMaterial attach="material-2" color="#b9b2a4" roughness={0.9} />
        <meshStandardMaterial attach="material-3" color="#b9b2a4" roughness={0.9} />
      </mesh>
      {/* roof garden edge */}
      <mesh position={[0, h + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.1, 0.1, d + 0.1]} />
        <meshStandardMaterial color="#e8e2d7" roughness={0.85} />
      </mesh>
      <mesh position={[0, h + 0.11, 0]} receiveShadow>
        <boxGeometry args={[w - 0.4, 0.04, d - 0.4]} />
        <meshStandardMaterial color="#6f8d48" roughness={1} />
      </mesh>
      {/* entrance canopy */}
      <mesh position={[0, h * 0.62, d / 2 + 0.7]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.07, 1.4]} />
        <meshStandardMaterial color="#2f3338" roughness={0.4} metalness={0.6} />
      </mesh>
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, h * 0.31, d / 2 + 1.3]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, h * 0.62, 12]} />
          <meshStandardMaterial color="#2f3338" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function useGroundTextures() {
  const textures = useMemo(() => {
    const rand = seeded(9);

    const [grassEl, g] = canvas2d(512, 512);
    g.fillStyle = "#6c8c43";
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) {
      const l = 30 + rand() * 22;
      g.fillStyle = `hsl(${80 + rand() * 22}, ${34 + rand() * 18}%, ${l}%)`;
      g.fillRect(rand() * 512, rand() * 512, 1 + rand() * 2, 2 + rand() * 4);
    }

    const [asphaltEl, a] = canvas2d(512, 512);
    a.fillStyle = "#47474b";
    a.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 14000; i++) {
      const v = 50 + Math.floor(rand() * 40);
      a.fillStyle = `rgb(${v}, ${v}, ${v + 3})`;
      a.fillRect(rand() * 512, rand() * 512, 1.5, 1.5);
    }

    const paver = (base: [number, number, number], seedShift: number) => {
      const [el, p] = canvas2d(512, 512);
      const r2 = seeded(seedShift);
      p.fillStyle = "#a99f8f";
      p.fillRect(0, 0, 512, 512);
      for (let y = 0; y < 16; y++) {
        for (let x = -1; x < 9; x++) {
          const k = 0.92 + r2() * 0.14;
          p.fillStyle = `rgb(${base[0] * k}, ${base[1] * k}, ${base[2] * k})`;
          p.fillRect(x * 64 + (y % 2) * 32 + 1.5, y * 32 + 1.5, 61, 29);
        }
      }
      return el;
    };

    return {
      grass: toTexture(grassEl, true, [36, 36]),
      asphalt: toTexture(asphaltEl, true, [40, 1.6]),
      plaza: toTexture(paver([222, 212, 194], 4), true, [6, 2]),
      walk: toTexture(paver([196, 192, 186], 5), true, [40, 1]),
    };
  }, []);
  useDisposeTextures(textures);
  return textures;
}

/* Footprints trees must stay clear of. */
const CLEAR: [number, number, number, number][] = [
  [-5.4, 5.4, -3.8, 4.5],
  [-8.2, -4.2, -6.4, -2.4],
  [4.6, 8.6, -8, -4],
  [-60, 60, 4.3, 9.2],
];

function ExteriorLandscape() {
  const tex = useGroundTextures();

  const { trunks, crowns, shrubs } = useMemo(() => {
    const rand = seeded(31);
    const trunkItems: Item[] = [];
    const crownItems: Item[] = [];
    const greens = ["#3f5f2a", "#4a6c30", "#56763a", "#36522a", "#5f7d3f", "#47662f"];
    const plant = (x: number, z: number, s: number) => {
      const th = 0.6 * s;
      trunkItems.push({ p: [x, th / 2, z], s: [s, th, s] });
      const blobs = 10 + Math.floor(rand() * 5);
      for (let b = 0; b < blobs; b++) {
        const a = rand() * Math.PI * 2;
        const spread = Math.sqrt(rand()) * 0.36 * s;
        const lift = rand();
        const r = (0.15 + rand() * 0.12) * s * (1 - lift * 0.35);
        crownItems.push({
          p: [x + Math.cos(a) * spread, th + 0.12 * s + lift * 0.62 * s, z + Math.sin(a) * spread],
          s: [r, r * (0.8 + rand() * 0.25), r],
          c: greens[Math.floor(rand() * greens.length)],
        });
      }
    };

    for (let x = -12; x <= 12; x += 2.2) {
      if (Math.abs(x) > 1.9) plant(x + (rand() - 0.5) * 0.3, 4.75, 0.95 + rand() * 0.2);
    }
    for (let x = -24; x <= 24; x += 2.6) {
      if (Math.abs(x) > 7.5) plant(x, 9.75, 0.9 + rand() * 0.25);
    }
    let placed = 0;
    while (placed < 46) {
      const x = (rand() - 0.5) * 34;
      const z = -14 + rand() * 18;
      const blocked = CLEAR.some(([x1, x2, z1, z2]) => x > x1 && x < x2 && z > z1 && z < z2);
      if (blocked) continue;
      plant(x, z, 0.8 + rand() * 0.6);
      placed++;
    }

    const shrubItems: Item[] = [];
    for (let x = -4.2; x <= 4.2; x += 0.42) {
      if (Math.abs(x) < 1.7) continue;
      const r = 0.16 + rand() * 0.06;
      shrubItems.push({ p: [x, r * 0.7, 2.75], s: [r, r * 0.8, r], c: greens[Math.floor(rand() * 5)] });
    }
    return { trunks: trunkItems, crowns: crownItems, shrubs: shrubItems };
  }, []);

  const lamps = useMemo(() => {
    const xs: number[] = [];
    for (let x = -13.1; x <= 13.1; x += 4.4) xs.push(x);
    return xs;
  }, []);

  const dashes = useMemo<Item[]>(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        p: [-40 + i * 1.6, 0.032, 6.75],
        s: [0.7, 0.005, 0.07],
      })),
    [],
  );

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial map={tex.grass} roughness={1} />
      </mesh>

      {/* forecourt and drop-off */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 3.4]} receiveShadow>
        <planeGeometry args={[12, 2.2]} />
        <meshStandardMaterial map={tex.plaza} roughness={0.85} />
      </mesh>
      {[-6.15, 6.15].map((x) => (
        <mesh key={x} position={[x, 0.18, 3.4]} castShadow receiveShadow>
          <boxGeometry args={[0.32, 0.36, 2.2]} />
          <meshStandardMaterial color="#3f6a2f" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.07, 2.75]} receiveShadow>
        <boxGeometry args={[8.8, 0.14, 0.5]} />
        <meshStandardMaterial color="#d8d1c4" roughness={0.9} />
      </mesh>
      <Instances items={shrubs}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={1} />
      </Instances>

      {/* footpaths and kerbs */}
      {[4.75, 8.95].map((z) => (
        <mesh key={z} position={[0, 0.06, z]} receiveShadow>
          <boxGeometry args={[120, 0.12, 0.9]} />
          <meshStandardMaterial map={tex.walk} roughness={0.9} />
        </mesh>
      ))}
      {[5.24, 8.46].map((z) => (
        <mesh key={z} position={[0, 0.07, z]} receiveShadow>
          <boxGeometry args={[120, 0.14, 0.1]} />
          <meshStandardMaterial color="#cfcac2" roughness={0.9} />
        </mesh>
      ))}

      {/* road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 6.85]} receiveShadow>
        <planeGeometry args={[120, 3.2]} />
        <meshStandardMaterial map={tex.asphalt} roughness={0.92} />
      </mesh>
      <Instances items={dashes} shadows={false}>
        <boxGeometry />
        <meshStandardMaterial color="#f1efe8" roughness={0.7} />
      </Instances>
      {[5.42, 8.28].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, z]}>
          <planeGeometry args={[120, 0.06]} />
          <meshStandardMaterial color="#e9e4d6" roughness={0.7} />
        </mesh>
      ))}

      <Instances items={trunks}>
        <cylinderGeometry args={[0.035, 0.06, 1, 7]} />
        <meshStandardMaterial color="#5e4630" roughness={1} />
      </Instances>
      <Instances items={crowns}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.95} />
      </Instances>

      {lamps.map((x) => (
        <group key={x} position={[x, 0, 5.05]}>
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.025, 1.3, 8]} />
            <meshStandardMaterial color="#2c2f33" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.3, 0.14]} castShadow>
            <boxGeometry args={[0.05, 0.03, 0.32]} />
            <meshStandardMaterial color="#2c2f33" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.28, 0.28]}>
            <boxGeometry args={[0.07, 0.015, 0.12]} />
            <meshStandardMaterial color="#fff2d6" emissive="#ffcf8a" emissiveIntensity={1.4} />
          </mesh>
        </group>
      ))}
    </>
  );
}

const CARS: { lane: number; dir: 1 | -1; offset: number; color: string; speed: number }[] = [
  { lane: 6.1, dir: 1, offset: 0, color: "#f2f2f0", speed: 1.9 },
  { lane: 6.1, dir: 1, offset: 17, color: "#1d2024", speed: 1.9 },
  { lane: 6.1, dir: 1, offset: 41, color: "#9a1f24", speed: 1.9 },
  { lane: 7.55, dir: -1, offset: 8, color: "#b9bdc2", speed: 2.2 },
  { lane: 7.55, dir: -1, offset: 30, color: "#2f4a6b", speed: 2.2 },
  { lane: 7.55, dir: -1, offset: 52, color: "#ecebe6", speed: 2.2 },
];

function Car({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.17, 0]} castShadow>
        <boxGeometry args={[0.95, 0.2, 0.42]} />
        <meshPhysicalMaterial color={color} roughness={0.25} metalness={0.6} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[-0.04, 0.33, 0]} castShadow>
        <boxGeometry args={[0.52, 0.15, 0.38]} />
        <meshPhysicalMaterial color="#1b2229" roughness={0.05} metalness={0.3} clearcoat={1} />
      </mesh>
      {[
        [0.3, 0.2],
        [-0.3, 0.2],
        [0.3, -0.2],
        [-0.3, -0.2],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.08, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 14]} />
          <meshStandardMaterial color="#141414" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Traffic({ reduced }: { reduced: boolean }) {
  const refs = useRef<(Group | null)[]>([]);
  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    CARS.forEach((car, i) => {
      const node = refs.current[i];
      if (!node) return;
      const span = 64;
      const raw = (car.offset + t * car.speed) % span;
      node.position.x = car.dir * (raw - span / 2);
    });
  });
  return (
    <>
      {CARS.map((car, i) => (
        <group
          key={i}
          ref={(node) => {
            refs.current[i] = node;
          }}
          position={[0, 0.03, car.lane]}
          rotation={[0, car.dir === 1 ? 0 : Math.PI, 0]}
        >
          <Car color={car.color} />
        </group>
      ))}
    </>
  );
}

function DistantCity() {
  const items = useMemo<Item[]>(() => {
    const rand = seeded(57);
    const tones = ["#e4dccf", "#d9d2c6", "#ebe4d8", "#d2cfc9", "#e0d9cc"];
    return Array.from({ length: 60 }, () => {
      const a = Math.PI * (1.08 + rand() * 0.84);
      const r = 46 + rand() * 44;
      const h = 2.5 + rand() * 6 + (rand() < 0.15 ? 5 : 0);
      const sw = 1.6 + rand() * 2.6;
      return {
        p: [Math.cos(a) * r, h / 2, Math.sin(a) * r * 0.9 - 4] as Vec3,
        s: [sw, h, 1.2 + rand() * 2.2] as Vec3,
        r: rand() * Math.PI,
        c: tones[Math.floor(rand() * tones.length)],
      };
    });
  }, []);

  const tex = useMemo(() => {
    const f = drawFacade({ bays: 6, floors: 14, seed: 5, lit: 0 });
    f.emissive.dispose();
    return { map: f.map, orm: f.orm };
  }, []);
  useDisposeTextures(tex);

  return (
    <Instances items={items} shadows={false}>
      <boxGeometry />
      <meshStandardMaterial map={tex.map} roughnessMap={tex.orm} metalnessMap={tex.orm} roughness={1} metalness={0.6} />
    </Instances>
  );
}

function ExteriorScene({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const a = 0.38 + Math.sin(t * 0.11) * 0.42;
    const r = 15.8 + Math.sin(t * 0.07) * 0.8;
    state.camera.position.set(Math.sin(a) * r, 2.5 + Math.sin(t * 0.09) * 0.35, Math.cos(a) * r + 1.5);
    state.camera.lookAt(-0.4, 4, -1);
  });

  return (
    <>
      <GoldenSky />
      <fog attach="fog" args={[HAZE, 24, 100]} />
      <hemisphereLight args={["#cfe0f2", "#8c7c5f", 0.45]} />
      <Sun position={SUN_POS} intensity={3.2} color="#ffdcb0" size={18} mapSize={2048} />

      <ExteriorLandscape />
      <Traffic reduced={reduced} />
      <DistantCity />

      <Podium position={[0, 0, -0.6]} w={9.6} d={5.6} h={0.95} />
      <GlassTower position={[0.4, 1.06, -0.9]} w={3.4} d={2.6} floors={22} seed={3} lit={0.08} />
      <GlassTower position={[-6.2, 0, -4.4]} w={3} d={2.6} floors={27} seed={8} lit={0.1} rotation={0.18} />
      <GlassTower position={[6.6, 0, -6]} w={2.8} d={2.4} floors={18} seed={14} lit={0.1} rotation={-0.12} />
    </>
  );
}

function InteriorScene({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    state.camera.position.set(Math.sin(t * 0.22) * 1.3, 1.75, 3.6);
    state.camera.lookAt(0, 0.95, -1.4);
  });

  const wall = "#efe6d8";
  return (
    <>
      <color attach="background" args={["#e9ddca"]} />
      <hemisphereLight args={["#fff4e2", "#a88b6a", 0.6]} />
      <Sun position={[9, 4.5, 1]} intensity={2.6} color="#fff0d4" size={8} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#b88a5c" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.6, -3]} receiveShadow>
        <boxGeometry args={[9, 3.2, 0.1]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[-4, 1.6, 0.5]} receiveShadow>
        <boxGeometry args={[0.1, 3.2, 7]} />
        <meshStandardMaterial color="#e6dccb" />
      </mesh>
      {/* right wall with a window opening */}
      <mesh position={[4, 0.4, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.8, 7]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[4, 2.75, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.9, 7]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      {[-2.6, -0.9, 0.8, 2.5].map((z) => (
        <mesh key={z} position={[4, 1.55, z]} castShadow>
          <boxGeometry args={[0.12, 1.5, 0.08]} />
          <meshStandardMaterial color="#2d2a33" />
        </mesh>
      ))}
      <mesh position={[6, 1.6, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[9, 4]} />
        <meshBasicMaterial color="#fff6e4" />
      </mesh>

      {/* rug, sofa, cushions */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -1.2]} receiveShadow>
        <planeGeometry args={[3.4, 2.4]} />
        <meshStandardMaterial color="#dccbab" />
      </mesh>
      <group position={[0, 0, -2.35]}>
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.44, 1]} />
          <meshStandardMaterial color="#344563" />
        </mesh>
        <mesh position={[0, 0.65, -0.4]} castShadow>
          <boxGeometry args={[3, 0.6, 0.22]} />
          <meshStandardMaterial color="#2f3e5a" />
        </mesh>
        {[-1.6, 1.6].map((x) => (
          <mesh key={x} position={[x, 0.38, 0]} castShadow>
            <boxGeometry args={[0.22, 0.76, 1]} />
            <meshStandardMaterial color="#2f3e5a" />
          </mesh>
        ))}
        {[-0.9, 0.9].map((x) => (
          <mesh key={x} position={[x, 0.66, -0.18]} rotation={[-0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 0.42, 0.14]} />
            <meshStandardMaterial color="#c99a3b" />
          </mesh>
        ))}
      </group>

      {/* coffee table */}
      <mesh position={[0, 0.42, -0.95]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.07, 0.75]} />
        <meshStandardMaterial color="#5a3d27" />
      </mesh>
      {[
        [-0.65, -0.3],
        [0.65, -0.3],
        [-0.65, 0.3],
        [0.65, 0.3],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.2, -0.95 + z]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#3a281b" />
        </mesh>
      ))}
      <mesh position={[0.3, 0.52, -0.95]} castShadow>
        <cylinderGeometry args={[0.09, 0.07, 0.14, 12]} />
        <meshStandardMaterial color="#f2efe8" />
      </mesh>

      {/* floor lamp with warm light */}
      <group position={[-2.1, 0, -2.3]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
          <meshStandardMaterial color="#2b2b2b" />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <coneGeometry args={[0.28, 0.34, 16, 1, true]} />
          <meshStandardMaterial color="#f6e2b6" emissive="#ffcf7a" emissiveIntensity={1.2} side={2} />
        </mesh>
        <pointLight position={[0, 1.5, 0]} intensity={4} distance={5} color="#ffc977" />
      </group>

      {/* plant */}
      <group position={[2.2, 0, -2.45]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.17, 0.44, 14]} />
          <meshStandardMaterial color="#d8cfc0" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <icosahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color="#4c7a3e" flatShading />
        </mesh>
      </group>

      {/* wall art */}
      <mesh position={[0, 1.85, -2.94]}>
        <planeGeometry args={[1.5, 0.95]} />
        <meshStandardMaterial color="#1b1446" />
      </mesh>
      <mesh position={[-0.25, 1.78, -2.93]}>
        <circleGeometry args={[0.24, 24]} />
        <meshStandardMaterial color="#f2a60f" />
      </mesh>
      <mesh position={[0.3, 1.7, -2.93]}>
        <planeGeometry args={[0.55, 0.4]} />
        <meshStandardMaterial color="#c8102e" />
      </mesh>
    </>
  );
}

const AERIAL_TOWERS: { p: Vec3; floors: number; seed: number }[] = [
  { p: [-4.5, 0, -4.5], floors: 14, seed: 2 },
  { p: [0, 0, -4.5], floors: 18, seed: 5 },
  { p: [4.5, 0, -4.5], floors: 12, seed: 9 },
  { p: [-4.5, 0, 0], floors: 16, seed: 13 },
  { p: [4.5, 0, 0], floors: 15, seed: 17 },
  { p: [-4.5, 0, 4.5], floors: 10, seed: 21 },
  { p: [0, 0, 4.5], floors: 13, seed: 25 },
  { p: [4.5, 0, 4.5], floors: 17, seed: 29 },
];

function AerialScene({ reduced }: { reduced: boolean }) {
  const trees = useMemo(() => {
    const rand = seeded(42);
    return Array.from({ length: 34 }, () => {
      const a = rand() * Math.PI * 2;
      const r = 1.2 + rand() * 1.1;
      return [Math.cos(a) * r, 0, Math.sin(a) * r] as Vec3;
    });
  }, []);

  return (
    <>
      <color attach="background" args={["#dce6e8"]} />
      <fog attach="fog" args={["#dce6e8", 26, 60]} />
      <hemisphereLight args={["#f4f8ff", "#7b8d5d", 0.8]} />
      <Sun position={[12, 18, 8]} intensity={2.2} size={16} />
      <Orbit radius={24} height={18} target={[0, 1.5, 0]} speed={0.07} start={0.9} reduced={reduced} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#a7b886" />
      </mesh>
      {/* perimeter and internal roads */}
      {[-7.2, 7.2].map((v) => (
        <group key={v}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, v]} receiveShadow>
            <planeGeometry args={[15.6, 1.2]} />
            <meshStandardMaterial color="#56555b" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[v, 0.01, 0]} receiveShadow>
            <planeGeometry args={[1.2, 15.6]} />
            <meshStandardMaterial color="#56555b" />
          </mesh>
        </group>
      ))}
      {[-2.25, 2.25].map((v) => (
        <group key={v}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, v]} receiveShadow>
            <planeGeometry args={[14, 0.7]} />
            <meshStandardMaterial color="#d9d2c2" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[v, 0.012, 0]} receiveShadow>
            <planeGeometry args={[0.7, 14]} />
            <meshStandardMaterial color="#d9d2c2" />
          </mesh>
        </group>
      ))}

      {AERIAL_TOWERS.map((t) => (
        <Tower key={t.seed} position={t.p} w={2} d={2} floors={t.floors} seed={t.seed} lit={0.18} glow={0.25} />
      ))}

      {/* central park with pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[2.6, 40]} />
        <meshStandardMaterial color="#86a85f" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color="#45b6d6" roughness={0.15} />
      </mesh>
      {trees.map((p, i) => (
        <Tree key={i} position={p} s={0.55} color={i % 3 ? "#4f7d3a" : "#3e6a30"} />
      ))}
    </>
  );
}

/* Walls as [x1, z1, x2, z2]; door gaps are just missing segments. */
const PLAN_WALLS: [number, number, number, number][] = [
  [-4, -3, 4, -3],
  [4, -3, 4, 3],
  [4, 3, -0.6, 3],
  [-1.6, 3, -4, 3],
  [-4, 3, -4, -3],
  [0, -3, 0, -1.1],
  [0, -0.1, 0, 3],
  [-4, 0, -1.6, 0],
  [-0.6, 0, 0, 0],
  [0, 0.2, 2.6, 0.2],
  [3.4, 0.2, 4, 0.2],
];

const PLAN_ROOMS: { x: number; z: number; w: number; d: number; color: string }[] = [
  { x: -2, z: 1.5, w: 4, d: 3, color: "#e9d8b8" },
  { x: -2, z: -1.5, w: 4, d: 3, color: "#d7dde0" },
  { x: 2, z: -1.4, w: 4, d: 3.2, color: "#eadfcf" },
  { x: 2, z: 1.6, w: 4, d: 2.8, color: "#d9e3e8" },
];

const PLAN_FURNITURE: { p: Vec3; s: Vec3; color: string }[] = [
  { p: [-2.4, 0.22, 2.3], s: [2, 0.44, 0.8], color: "#344563" },
  { p: [-2.4, 0.2, 1.2], s: [1, 0.06, 0.6], color: "#5a3d27" },
  { p: [-3.55, 0.45, -1.5], s: [0.7, 0.9, 2.6], color: "#f2efe8" },
  { p: [-2, 0.4, -2.6], s: [2, 0.8, 0.6], color: "#f2efe8" },
  { p: [2, 0.25, -1.9], s: [1.8, 0.5, 2], color: "#c99a3b" },
  { p: [2.2, 0.25, 1.9], s: [1.6, 0.5, 1.8], color: "#8ea6b8" },
  { p: [-2.4, 0.55, 2.62], s: [2, 0.3, 0.2], color: "#2a3852" },
  { p: [2, 0.56, -2.6], s: [1.4, 0.12, 0.4], color: "#fbf8f2" },
  { p: [2.2, 0.56, 2.55], s: [1.2, 0.12, 0.4], color: "#fbf8f2" },
];

function PlanScene({ reduced }: { reduced: boolean }) {
  const walls = useRef<Group>(null);
  const furniture = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime % 11;
    const k = reduced ? 1 : smooth(1.4, 3.8, t) * (1 - smooth(9, 10.6, t));
    if (walls.current) walls.current.scale.y = 0.02 + k * 0.98;
    if (furniture.current) {
      const f = reduced ? 1 : smooth(3.2, 4.4, t) * (1 - smooth(8.6, 9.4, t));
      furniture.current.scale.setScalar(Math.max(f, 0.0001));
    }
    const polar = 0.04 + k * 0.74;
    const azimuth = 0.7 + (reduced ? 0 : state.clock.elapsedTime * 0.08);
    const r = 15 - k * 2.2;
    state.camera.position.set(
      Math.sin(polar) * Math.cos(azimuth) * r,
      Math.cos(polar) * r,
      Math.sin(polar) * Math.sin(azimuth) * r,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#f4efe6"]} />
      <hemisphereLight args={["#ffffff", "#cbbfa8", 0.9]} />
      <Sun position={[6, 12, 5]} intensity={1.9} size={8} />
      <gridHelper args={[20, 40, "#d3c8b4", "#e4dccd"]} position={[0, 0.001, 0]} />

      {PLAN_ROOMS.map((room) => (
        <mesh
          key={`${room.x}${room.z}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[room.x, 0.01, room.z]}
          receiveShadow
        >
          <planeGeometry args={[room.w, room.d]} />
          <meshStandardMaterial color={room.color} />
        </mesh>
      ))}

      <group ref={walls}>
        {PLAN_WALLS.map(([x1, z1, x2, z2]) => {
          const len = Math.hypot(x2 - x1, z2 - z1) + 0.15;
          const angle = -Math.atan2(z2 - z1, x2 - x1);
          return (
            <mesh
              key={`${x1}${z1}${x2}${z2}`}
              position={[(x1 + x2) / 2, 0.55, (z1 + z2) / 2]}
              rotation={[0, angle, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[len, 1.1, 0.15]} />
              <meshStandardMaterial color="#fbf8f2" />
            </mesh>
          );
        })}
      </group>

      <group ref={furniture}>
        {PLAN_FURNITURE.map((item) => (
          <mesh key={item.p.join()} position={item.p} castShadow>
            <boxGeometry args={item.s} />
            <meshStandardMaterial color={item.color} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function AmenityScene({ reduced }: { reduced: boolean }) {
  const water = useRef<MeshStandardMaterial>(null);
  useFrame((state) => {
    if (water.current && !reduced) {
      water.current.emissiveIntensity = 0.28 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08;
    }
  });

  return (
    <>
      <color attach="background" args={["#cfe4ec"]} />
      <fog attach="fog" args={["#cfe4ec", 20, 48]} />
      <hemisphereLight args={["#f2f9ff", "#7e9a5c", 0.85]} />
      <Sun position={[8, 11, 6]} intensity={2.3} size={12} />
      <Orbit radius={12} height={5.4} target={[0, 0.6, 0]} speed={0.09} start={1.1} reduced={reduced} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#8fb267" />
      </mesh>
      <mesh position={[0, 0.05, 0.4]} receiveShadow>
        <boxGeometry args={[9, 0.1, 5.4]} />
        <meshStandardMaterial color="#c9a57a" />
      </mesh>
      <mesh position={[0, 0.11, 0.6]} receiveShadow>
        <boxGeometry args={[5.6, 0.04, 2.8]} />
        <meshStandardMaterial color="#f4f1ea" />
      </mesh>
      <mesh position={[0, 0.135, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.2, 2.4]} />
        <meshStandardMaterial
          ref={water}
          color="#2fa9cf"
          emissive="#6fe0f4"
          emissiveIntensity={0.28}
          roughness={0.08}
          metalness={0.15}
        />
      </mesh>

      {[-2.2, -0.9, 0.4, 1.7].map((x) => (
        <group key={x} position={[x, 0.1, 2.55]}>
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.5, 0.08, 1.1]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.3, -0.48]} rotation={[0.9, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.06, 0.45]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
      {[-1.55, 1.05].map((x, i) => (
        <group key={x} position={[x, 0.1, 2.3]}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.4, 8]} />
            <meshStandardMaterial color="#e8e1d4" />
          </mesh>
          <mesh position={[0, 1.42, 0]} castShadow>
            <coneGeometry args={[0.8, 0.32, 8]} />
            <meshStandardMaterial color={i ? "#f2a60f" : "#c8102e"} flatShading />
          </mesh>
        </group>
      ))}

      {/* clubhouse with glass front */}
      <group position={[0, 0, -3.4]}>
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.6, 1.8, 2]} />
          <meshStandardMaterial color="#f4efe6" />
        </mesh>
        <mesh position={[0, 0.85, 1.01]}>
          <planeGeometry args={[4.6, 1.3]} />
          <meshStandardMaterial color="#5f86a3" roughness={0.1} metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.88, 0.3]} castShadow>
          <boxGeometry args={[6.4, 0.14, 2.9]} />
          <meshStandardMaterial color="#2d2a33" />
        </mesh>
      </group>

      {/* pergola */}
      <group position={[3.6, 0.1, 0.4]}>
        {[
          [-0.7, -0.9],
          [0.7, -0.9],
          [-0.7, 0.9],
          [0.7, 0.9],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.75, z]} castShadow>
            <boxGeometry args={[0.08, 1.5, 0.08]} />
            <meshStandardMaterial color="#6b4a2f" />
          </mesh>
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i} position={[0, 1.52, -0.9 + i * 0.3]} castShadow>
            <boxGeometry args={[1.7, 0.06, 0.08]} />
            <meshStandardMaterial color="#7a5435" />
          </mesh>
        ))}
      </group>

      {/* hedges and palms */}
      {[-4.8, 4.8].map((x) => (
        <mesh key={x} position={[x, 0.3, 0.4]} castShadow>
          <boxGeometry args={[0.5, 0.6, 5.4]} />
          <meshStandardMaterial color="#3f6b33" />
        </mesh>
      ))}
      <Palm position={[-3.8, 0.1, -1.4]} s={1.1} lean={0.14} />
      <Palm position={[-3.6, 0.1, 2.6]} s={0.9} lean={-0.1} />
      <Palm position={[4.2, 0.1, -1.8]} s={1} lean={-0.12} />
      <Tree position={[2.6, 0.1, 3.4]} s={0.8} />
      <Tree position={[-2.8, 0.1, -2]} s={0.7} />
    </>
  );
}

function Scene({ kind, reduced }: { kind: RenderKind; reduced: boolean }) {
  switch (kind) {
    case "exterior":
      return <ExteriorScene reduced={reduced} />;
    case "interior":
      return <InteriorScene reduced={reduced} />;
    case "aerial":
      return <AerialScene reduced={reduced} />;
    case "plan":
      return <PlanScene reduced={reduced} />;
    case "amenity":
      return <AmenityScene reduced={reduced} />;
  }
}

export function ServicesRenderStage({ kind, reduced }: { kind: RenderKind; reduced: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="svc-render-canvas" aria-hidden>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        frameloop={inView ? (reduced ? "demand" : "always") : "never"}
        camera={{ fov: 38, position: [10, 5, 10], near: 0.1, far: 200 }}
        gl={{ antialias: true, powerPreference: "high-performance", stencil: false }}
      >
        <ambientLight intensity={0.35} />
        <Scene key={kind} kind={kind} reduced={reduced} />
      </Canvas>
    </div>
  );
}
