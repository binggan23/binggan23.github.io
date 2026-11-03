import { useEffect, useRef } from "react";
import * as THREE from "three";

const LIME = 0xc8f751;
const BONE = 0xdfe6c4;

/**
 * Reactor apparatus — a slatted containment column with a live core,
 * hazard collars, scanning beam and orbital furniture. It answers to the
 * pointer, pulses on click, accelerates with scroll velocity and comes
 * apart as the hero leaves the viewport.
 */
export type ReactorTelemetry = { rpm: number; core: number; spin: number };

type HeroStageProps = {
  className?: string;
  onTelemetry?: (t: ReactorTelemetry) => void;
  onReady?: (api: { ignite: () => void }) => void;
};

/**
 * Reactor apparatus — a slatted containment column with a live core,
 * hazard collars, scanning beam and orbital furniture. It answers to the
 * pointer, pulses on click, accelerates with scroll velocity and comes
 * apart as the hero leaves the viewport.
 */
export default function HeroStage({ className, onTelemetry, onReady }: HeroStageProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 90);
    camera.position.set(0, 0.4, 9.6);
    camera.lookAt(0, 0.05, 0);

    const world = new THREE.Group();
    scene.add(world);

    /* ——— materials ——— */
    const matShell = new THREE.MeshStandardMaterial({ color: 0x131b08, roughness: 0.42, metalness: 0.55 });
    const matLime = new THREE.MeshStandardMaterial({ color: LIME, roughness: 0.34, metalness: 0.08, emissive: 0x1d2b05, emissiveIntensity: 0.42 });
    const matBone = new THREE.MeshStandardMaterial({ color: 0xdfe6c4, roughness: 0.72, metalness: 0.08 });
    const matCore = new THREE.MeshStandardMaterial({ color: 0xf6f8e6, roughness: 0.32, metalness: 0, emissive: 0xe9f5c0, emissiveIntensity: 1.15 });
    const matLine = new THREE.LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.55 });
    const matLineBone = new THREE.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.32 });

    /* ——— reactor column ——— */
    const column = new THREE.Group();
    const H = 3.9;
    const R = 0.86;

    // inner core + glow
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, H - 0.5, 32, 1, false), matCore);
    column.add(core);
    const glow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56, 0.56, H - 0.4, 32, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xf0f6cf, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    column.add(glow);

    // slatted shell
    const slatCount = 18;
    const slatGeo = new THREE.BoxGeometry(0.19, H, 0.075);
    for (let i = 0; i < slatCount; i++) {
      const a = (i / slatCount) * Math.PI * 2;
      const slat = new THREE.Mesh(slatGeo, matShell);
      slat.position.set(Math.cos(a) * R, 0, Math.sin(a) * R);
      slat.rotation.y = -a + Math.PI / 2;
      column.add(slat);
    }

    // hazard collars — alternating lime / bone segments
    const makeCollar = (y: number, tube: number) => {
      const seg = 24;
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI * 2;
        const a1 = ((i + 1) / seg) * Math.PI * 2;
        const geo = new THREE.TorusGeometry(R + 0.02, tube, 6, 8, a1 - a0);
        const ring = new THREE.Mesh(geo, i % 2 === 0 ? matLime : matBone);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = a0;
        ring.position.y = y;
        column.add(ring);
      }
    };
    makeCollar(1.94, 0.045);
    makeCollar(-1.94, 0.045);

    // caps
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.05, 72), matBone);
    capTop.position.y = 1.97;
    column.add(capTop);
    const capBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.05, 72), matLime);
    capBottom.position.y = -1.97;
    column.add(capBottom);

    // ribs
    const ribCount = 9;
    const ribs: THREE.Mesh[] = [];
    for (let i = 0; i < ribCount; i++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(R + 0.005, 0.0075, 6, 64), matBone);
      rib.rotation.x = Math.PI / 2;
      rib.position.y = -1.75 + (i / (ribCount - 1)) * 3.5;
      ribs.push(rib);
      column.add(rib);
    }

    // travelling scan ring
    const scanRing = new THREE.Mesh(
      new THREE.TorusGeometry(R + 0.09, 0.012, 8, 96),
      new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.9 }),
    );
    scanRing.rotation.x = Math.PI / 2;
    column.add(scanRing);

    // wireframe halo cage around column
    column.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(R + 0.12, R + 0.12, H + 0.3, 8, 1, true)), matLineBone));

    column.rotation.z = THREE.MathUtils.degToRad(14);
    column.position.set(-0.3, -0.1, 0);
    world.add(column);

    // expanding shock rings (click feedback)
    const shockGeo = new THREE.TorusGeometry(1, 0.02, 6, 96);
    const shocks = [0, 1].map((i) => {
      const m = new THREE.Mesh(shockGeo, new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0 }));
      m.rotation.x = Math.PI / 2;
      m.position.y = -2 + i * 4;
      m.scale.setScalar(0.001);
      column.add(m);
      return { mesh: m, life: 0 };
    });

    /* ——— beam ——— */
    const beam = new THREE.Group();
    const beamMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5.1, 0.3), matLime);
    beam.add(beamMesh);
    beam.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.305, 5.1, 0.305)), matLine));
    beam.rotation.z = THREE.MathUtils.degToRad(-26);
    beam.position.set(1.25, 0.2, 0.5);
    world.add(beam);

    /* ——— cross bars ——— */
    const barA = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.03, 0.03), matBone);
    barA.position.set(0.1, 1.2, 0.1);
    barA.rotation.z = THREE.MathUtils.degToRad(-8);
    world.add(barA);
    const barB = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.03, 0.03), matBone);
    barB.position.set(0.2, -1.35, 0.2);
    barB.rotation.z = THREE.MathUtils.degToRad(5);
    world.add(barB);

    /* ——— plate ——— */
    const plate = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 0.04), new THREE.MeshStandardMaterial({ color: 0x151d09, roughness: 0.9 }));
    plate.rotation.set(THREE.MathUtils.degToRad(74), THREE.MathUtils.degToRad(-12), THREE.MathUtils.degToRad(8));
    plate.position.set(1.85, -1.5, -1.3);
    world.add(plate);
    const plateEdges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.2, 2.2, 0.04)), matLineBone);
    plateEdges.rotation.copy(plate.rotation);
    plateEdges.position.copy(plate.position);
    world.add(plateEdges);

    /* ——— sphere ——— */
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.42, 48, 48), matBone);
    sphere.position.set(-2.3, 1.7, 0.5);
    world.add(sphere);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.005, 6, 80), matLine);
    halo.position.copy(sphere.position);
    halo.rotation.x = THREE.MathUtils.degToRad(74);
    world.add(halo);

    /* ——— orbit rings ——— */
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.009, 6, 240), matLine);
    ring.rotation.set(THREE.MathUtils.degToRad(72), THREE.MathUtils.degToRad(12), 0);
    ring.position.set(0.15, 0.05, -0.4);
    world.add(ring);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.006, 6, 240), matLineBone);
    ring2.rotation.set(THREE.MathUtils.degToRad(64), THREE.MathUtils.degToRad(-26), 0);
    ring2.position.set(0.15, 0.05, -0.9);
    world.add(ring2);

    /* ——— cage ——— */
    const cagePts: number[] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      cagePts.push(Math.cos(a) * 2.5, -2.7, Math.sin(a) * 2.5, Math.cos(a) * 2.5, 2.7, Math.sin(a) * 2.5);
    }
    const cageGeo = new THREE.BufferGeometry();
    cageGeo.setAttribute("position", new THREE.Float32BufferAttribute(cagePts, 3));
    const cage = new THREE.LineSegments(cageGeo, new THREE.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.1 }));
    world.add(cage);

    /* ——— dust ——— */
    const dustCount = 260;
    const positions = new Float32Array(dustCount * 3);
    const seeds = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
      seeds[i] = Math.random();
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: BONE, size: 0.024, transparent: true, opacity: 0.4, depthWrite: false }));
    world.add(dust);

    /* ——— lights ——— */
    scene.add(new THREE.HemisphereLight(0xfdfbf0, 0x1b2410, 0.9));
    const key = new THREE.DirectionalLight(0xfdfaef, 2.9);
    key.position.set(-4, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xe6ffb0, 1.7);
    rim.position.set(6, -3, -5);
    scene.add(rim);
    const coreLight = new THREE.PointLight(0xf2f8d8, 8, 11, 2);
    coreLight.position.set(0, 0, 0);
    column.add(coreLight);

    /* ——— entrance: the apparatus assembles itself ——— */
    const slats: THREE.Mesh[] = [];
    column.children.forEach((c) => {
      if ((c as THREE.Mesh).geometry === slatGeo) slats.push(c as THREE.Mesh);
    });
    const collars: THREE.Object3D[] = [];
    column.children.forEach((c) => {
      const g = (c as THREE.Mesh).geometry as THREE.TorusGeometry | undefined;
      if (g && g.type === "TorusGeometry" && (g.parameters as { radius: number }).radius === R + 0.02) collars.push(c);
    });
    const bootStart = performance.now() + 2150;
    const BOOT_MS = 1500;
    let boot = reduce ? 1 : 0;

    onReady?.({
      ignite: () => {
        pulse = 1;
        shocks.forEach((s, i) => {
          s.life = 1 - i * 0.18;
          s.mesh.scale.setScalar(0.02);
        });
      },
    });

    /* ——— sizing ——— */
    const resize = () => {
      const { clientWidth: wd, clientHeight: ht } = host;
      if (!wd || !ht) return;
      renderer.setSize(wd, ht, false);
      camera.aspect = wd / ht;
      camera.updateProjectionMatrix();
      const small = wd < 760;
      const wide = wd >= 1700;
      world.scale.setScalar(small ? 0.56 : wd < 1180 ? 0.82 : 1);
      world.position.x = small ? 0.2 : wd < 1180 ? 1.25 : wd < 1500 ? 1.5 : wide ? 2.2 : 1.75;
      world.position.y = small ? 1.7 : 0.25;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let pulse = 0;

    /* ——— input: pointer parallax + drag-to-spin ——— */
    const target = new THREE.Vector2(0, 0);
    const current = new THREE.Vector2(0, 0);
    let dragging = false;
    let dragX = 0;
    let lastX = 0;
    let dragVel = 0;

    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!dragging) return;
      dragVel = (e.clientX - lastX) * 0.006;
      dragX += dragVel;
      lastX = e.clientX;
    };
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, input")) return;
      dragging = true;
      lastX = e.clientX;
      dragVel = 0;
      host.style.cursor = "grabbing";
    };
    const onUp = () => {
      dragging = false;
      host.style.cursor = "";
      spinVel += dragVel * 2.4;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    host.style.cursor = "grab";

    const onTap = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button")) return;
      pulse = 1;
      shocks.forEach((s, i) => {
        s.life = 1 - i * 0.18;
        s.mesh.scale.setScalar(0.02);
      });
    };
    window.addEventListener("pointerdown", onTap, { passive: true });

    let scrollProgress = 0;
    let spin = 0;
    let spinVel = 0;
    let lastY = window.scrollY;
    const readScroll = () => {
      const rect = host.getBoundingClientRect();
      scrollProgress = THREE.MathUtils.clamp(-rect.top / (window.innerHeight * 0.9), 0, 1);
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      spinVel += dy * 0.00022;
    };
    window.addEventListener("scroll", readScroll, { passive: true });
    readScroll();

    /* ——— loop ——— */
    let raf = 0;
    let visible = true;
    const clock = new THREE.Clock();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduce) start();
      else stop();
    }, { threshold: 0.01 });
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    function start() {
      if (raf) return;
      clock.start();
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    const ease = (v: number) => v * v * (3 - 2 * v);
    let lastReport = 0;

    const tick = () => {
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);
      current.lerp(target, 0.06);
      const p = ease(scrollProgress);

      const bootT = reduce ? 1 : THREE.MathUtils.clamp((performance.now() - bootStart) / BOOT_MS, 0, 1);
      boot += (bootT - boot) * 0.16;
      const b = ease(THREE.MathUtils.clamp(boot, 0, 1));

      pulse = Math.max(0, pulse - dt * 1.6);
      spinVel *= 1 - Math.min(1, dt * 2.2);
      spin += dt * (0.42 + Math.abs(spinVel) * 1.7);
      dragVel *= 1 - Math.min(1, dt * 3.4);
      spin += dragX * 0.02;
      dragX *= 1 - Math.min(1, dt * 2.2);

      camera.position.z = 9.6 - p * 3.4;
      camera.position.y = 0.4 + p * 1.5;
      camera.position.x = current.x * 0.35;
      camera.lookAt(0, 0.05 + p * 0.2, 0);

      world.rotation.y = Math.sin(t * 0.14) * 0.1 + current.x * 0.34 + p * 0.9;
      world.rotation.x = current.y * -0.08 + p * 0.12;
      world.rotation.z = p * -0.22;

      // reactor
      column.rotation.y = spin;

      // slats fly into the ring, then settle into their individual jitter
      slats.forEach((slat, i) => {
        const a = (i / slats.length) * Math.PI * 2;
        const spread = 1 + (1 - b) * 1.9;
        slat.position.x = Math.cos(a) * R * spread;
        slat.position.z = Math.sin(a) * R * spread;
        slat.position.y = (1 - b) * Math.sin(i * 1.7) * 1.4;
        slat.scale.y = 0.06 + b * 0.94;
      });
      collars.forEach((c, i) => {
        c.scale.setScalar(0.35 + b * 0.65);
        c.position.y = (c.position.y > 0 ? 1.94 : -1.94) * (0.25 + b * 0.75) + (1 - b) * (i % 2 ? 1 : -1) * 0.8;
      });
      capTop.position.y = 1.97 + (1 - b) * 1.4;
      capBottom.position.y = -1.97 - (1 - b) * 1.4;
      capTop.scale.setScalar(0.4 + b * 0.6);
      capBottom.scale.setScalar(0.4 + b * 0.6);
      beam.scale.y = 0.05 + b * 0.95;
      beam.position.x = 1.25 + (1 - b) * 1.9;
      sphere.scale.setScalar(0.15 + b * 0.85);
      plate.scale.setScalar(0.3 + b * 0.7);
      plateEdges.scale.setScalar(0.3 + b * 0.7);
      ring.scale.setScalar(0.35 + b * 0.65);
      ring2.scale.setScalar(0.25 + b * 0.75);
      (scanRing.material as THREE.MeshBasicMaterial).opacity *= b;
      column.position.y = -0.1 + Math.sin(t * 0.55) * 0.07 + p * 0.55;
      column.rotation.z = THREE.MathUtils.degToRad(14) + Math.sin(t * 0.4) * 0.025 - p * 0.1;
      column.rotation.x = current.y * 0.07;

      const breathe = (0.84 + Math.sin(t * 1.6) * 0.1 + pulse * 0.7) * b;
      matCore.emissiveIntensity = 1.15 * breathe;
      coreLight.intensity = 7.5 * breathe;
      (glow.material as THREE.MeshBasicMaterial).opacity = 0.1 * b;
      glow.scale.setScalar(0.98 + Math.sin(t * 1.6) * 0.03 + pulse * 0.12);
      matLime.emissiveIntensity = 0.75 + pulse * 1.2;

      scanRing.position.y = -1.85 + ((t * 0.55) % 1) * 3.7;
      (scanRing.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin((t * 0.55) % 1 * Math.PI) * 0.55;

      ribs.forEach((rib, i) => {
        rib.scale.setScalar(1 + Math.sin(t * 2 + i * 0.7) * 0.006 + pulse * 0.02);
      });

      shocks.forEach((s) => {
        if (s.life > 0) {
          s.life = Math.max(0, s.life - dt * 1.3);
          s.mesh.scale.setScalar(1 + (1 - s.life) * 7);
          (s.mesh.material as THREE.MeshBasicMaterial).opacity = s.life * 0.5;
        } else {
          (s.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      });

      beam.position.y = 0.2 + Math.sin(t * 0.45 + 1.2) * 0.1 + p * 1.1;
      beam.position.x = 1.25 + p * 0.85;
      beam.rotation.z = THREE.MathUtils.degToRad(-26) + Math.cos(t * 0.32) * 0.03 - p * 0.16;
      beam.rotation.y = t * 0.2;

      barA.position.x = 0.1 - p * 1.1;
      barB.position.x = 0.2 + p * 1.2;
      barA.position.y = 1.2 + p * 1.4;
      barB.position.y = -1.35 - p * 1.1;

      sphere.position.y = 1.7 + Math.sin(t * 0.75 + 0.6) * 0.1 + p * 0.9;
      sphere.position.x = -2.3 - p * 0.8;
      sphere.rotation.y = t * 0.4;
      halo.position.copy(sphere.position);
      halo.rotation.z = t * 0.5;

      plate.position.y = -1.5 - p * 1.2;
      plate.position.x = 1.85 + p * 0.7;
      plate.rotation.z = THREE.MathUtils.degToRad(8) + Math.sin(t * 0.28) * 0.05;
      plateEdges.position.copy(plate.position);
      plateEdges.rotation.copy(plate.rotation);

      ring.rotation.z = t * 0.14 + p * 0.6;
      ring2.rotation.z = -t * 0.1 - p * 0.45;
      cage.rotation.y = -t * 0.06;

      dust.rotation.y = t * 0.03;
      const arr = dustGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < dustCount; i++) {
        arr.setY(i, positions[i * 3 + 1] * 0.9 + Math.sin(t * 0.3 + seeds[i] * 6.283) * 0.3);
      }
      arr.needsUpdate = true;

      if (onTelemetry && t - lastReport > 0.12) {
        lastReport = t;
        onTelemetry({ rpm: Math.round(Math.abs(spinVel) * 900 + 60), core: Math.round(matCore.emissiveIntensity * 100), spin: spin % (Math.PI * 2) });
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      column.rotation.y = 0.7;
      renderer.render(scene, camera);
    } else {
      start();
    }

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointerdown", onTap);
      window.removeEventListener("scroll", readScroll);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
