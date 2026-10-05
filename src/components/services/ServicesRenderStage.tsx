"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, SRGBColorSpace, type Group, type MeshStandardMaterial } from "three";

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

function Sun({ position, intensity = 2, color = "#fff1d6", size = 14 }: { position: Vec3; intensity?: number; color?: string; size?: number }) {
  return (
    <directionalLight
      position={position}
      intensity={intensity}
      color={color}
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-bias={-0.0004}
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

function ExteriorScene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <color attach="background" args={["#f3dcc0"]} />
      <fog attach="fog" args={["#f3dcc0", 22, 52]} />
      <hemisphereLight args={["#fff1dc", "#7d8a64", 1.2]} />
      <Sun position={[9, 8, 7]} intensity={2.6} color="#ffdcae" />
      <Orbit radius={14.5} height={4.6} target={[0, 3, 0]} speed={0.1} start={0.6} reduced={reduced} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#c8c0a6" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 4.4]} receiveShadow>
        <planeGeometry args={[40, 2]} />
        <meshStandardMaterial color="#4b4a50" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 2.6]} receiveShadow>
        <planeGeometry args={[10, 1.4]} />
        <meshStandardMaterial color="#7da15a" />
      </mesh>
      <mesh position={[0, 0.25, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[9, 0.5, 5]} />
        <meshStandardMaterial color="#e2d9c8" />
      </mesh>

      <Tower position={[0, 0.5, 0]} w={2.2} d={2.2} floors={17} seed={3} lit={0.16} glow={0.7} />
      <Tower position={[3.3, 0.5, -1.6]} w={1.8} d={1.8} floors={12} seed={7} lit={0.14} glow={0.7} />
      <Tower position={[-3.1, 0.5, -2]} w={1.8} d={1.8} floors={10} seed={11} lit={0.12} glow={0.7} />

      {[-4.4, -3.1, -1.8, 1.8, 3.1, 4.4].map((x) => (
        <Tree key={x} position={[x, 0, 2.6]} s={0.9} />
      ))}
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
