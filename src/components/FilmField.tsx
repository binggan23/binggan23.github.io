import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Scroll-scrubbed "footage": five procedural scenes (core bloom, topography,
 * hazard bars, slit-scan, terminal grid) cross-dissolving on uProgress, with
 * grain, scanlines and a rolling shutter band.
 */
const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uRes;
  uniform vec2 uMouse;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }
  float band(float x, float c, float w) {
    return smoothstep(w, 0.0, abs(x - c));
  }
  mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  vec3 lime = vec3(0.784, 0.969, 0.318);
  vec3 bone = vec3(0.909, 0.933, 0.824);
  vec3 dark = vec3(0.043, 0.059, 0.016);

  vec3 sceneCore(vec2 st, float t) {
    vec2 p = st * rot(t * 0.12);
    float r = length(p);
    float a = atan(p.y, p.x);
    float spokes = pow(abs(sin(a * 5.0 + t * 0.4 + fbm(p * 2.0) * 2.2)), 6.0);
    float burn = smoothstep(1.05, 0.0, r);
    vec3 c = dark;
    c += lime * spokes * burn * 0.42;
    c += bone * smoothstep(0.3, 0.0, r) * 0.26;
    c += lime * smoothstep(0.9, 0.55, r) * 0.09;
    c += bone * band(r, 0.62 + sin(t * 0.7) * 0.02, 0.005) * 0.45;
    return c;
  }

  vec3 sceneTopo(vec2 st, float t) {
    vec2 q = st * 1.5;
    q += vec2(fbm(q * 1.1 + t * 0.12), fbm(q * 1.1 - t * 0.12)) * 0.6;
    float d = length(q);
    float wave = fbm(q * 2.3 + vec2(t * 0.1, -t * 0.07)) * 1.5;
    float lines = fract((d + wave) * 15.0);
    float line = smoothstep(0.9, 0.995, lines) * smoothstep(0.0, 0.2, lines);
    line *= 1.0 - smoothstep(0.4, 1.3, d);
    vec3 c = dark;
    c = mix(c, bone, line * 0.34);
    c += lime * smoothstep(0.75, 0.2, d) * 0.05;
    return c;
  }

  vec3 sceneBars(vec2 st, float t) {
    vec2 p = st;
    float sk = (p.x + p.y) * 6.0 - t * 0.6;
    float stripes = step(0.5, fract(sk));
    float mask = smoothstep(0.9, 0.2, abs(p.y * 1.2 + sin(p.x * 2.0 + t * 0.5) * 0.25));
    vec3 c = dark;
    c = mix(c, lime, stripes * mask * 0.3);
    c += bone * band(p.y, sin(t * 0.6) * 0.5, 0.004) * 0.3;
    c += lime * band(p.x, 0.0, 0.006) * 0.18;
    return c;
  }

  vec3 sceneSlit(vec2 st, float t) {
    vec2 p = st;
    float cols = floor((p.x + 0.75) * 26.0);
    float h = hash(vec2(cols, floor(t * 1.2)));
    float colMask = step(0.55, fract((p.x + 0.75) * 26.0));
    float bar = smoothstep(0.5, 0.0, abs(fract(p.y * 3.0 + h) - 0.5));
    vec3 c = dark;
    c += lime * colMask * bar * 0.3 * (0.4 + h);
    c += bone * smoothstep(0.02, 0.0, abs(p.x)) * 0.4;
    c += bone * smoothstep(0.02, 0.0, abs(p.y)) * 0.2;
    return c;
  }

  vec3 sceneGrid(vec2 st, float t) {
    vec2 p = st;
    p.y += sin(p.x * 3.0 + t * 0.35) * 0.06;
    vec2 g = abs(fract(p * vec2(9.0, 5.0)) - 0.5);
    float grid = smoothstep(0.48, 0.5, max(g.x, g.y));
    float sweep = smoothstep(0.6, 0.0, abs(p.x - (fract(t * 0.15) * 2.0 - 1.0)));
    vec3 c = dark;
    c = mix(c, bone, grid * 0.18);
    c += lime * sweep * 0.22 * (1.0 - length(p) * 0.5);
    c += lime * smoothstep(0.5, 0.0, length(p)) * 0.1;
    return c;
  }

  void main() {
    vec2 st = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    st += (uMouse - 0.5) * 0.08;
    float t = uTime;

    float p = clamp(uProgress, 0.0, 1.0) * 4.0;
    float i0 = floor(p);
    float f = smoothstep(0.0, 1.0, fract(p));

    vec3 a, b;
    if (i0 < 0.5) { a = sceneCore(st, t); b = sceneTopo(st, t); }
    else if (i0 < 1.5) { a = sceneTopo(st, t); b = sceneBars(st, t); }
    else if (i0 < 2.5) { a = sceneBars(st, t); b = sceneSlit(st, t); }
    else if (i0 < 3.5) { a = sceneSlit(st, t); b = sceneGrid(st, t); }
    else { a = sceneGrid(st, t); b = sceneCore(st, t * 1.3); }

    float edge = smoothstep(-0.35, 0.35, (f * 1.4 - 0.2) - (st.y * 0.5 + 0.5) * 0.9 + 0.45);
    vec3 col = mix(a, b, edge);

    float shutter = smoothstep(0.06, 0.0, abs(st.y - (fract(t * 0.17) * 2.4 - 1.2)));
    col += lime * shutter * 0.05;
    float scan = step(0.5, fract(vUv.y * uRes.y * 0.5));
    col *= 0.96 + scan * 0.04;
    float g = hash(vUv * uRes + fract(t) * 87.0);
    col += (g - 0.5) * 0.045;

    col *= mix(1.0, 0.42, smoothstep(0.28, 1.2, length(st)));
    col.r += 0.012 * smoothstep(0.2, 0.0, abs(st.x - 0.42));
    col.b += 0.012 * smoothstep(0.2, 0.0, abs(st.x + 0.42));

    // grade: desaturate toward warm bone so the footage reads as printed film,
    // not a green monochrome monitor; lime survives only in the highlights
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 warm = vec3(lum) * vec3(1.0, 0.97, 0.86);
    col = mix(col, warm, 0.62);
    col *= 1.22;
    col = mix(col, vec3(0.909, 0.933, 0.824) * pow(lum, 1.3), 0.18);
    // a whisper of lime stays in the hottest pixels only
    col += vec3(0.784, 0.969, 0.318) * smoothstep(0.55, 1.0, lum) * 0.1;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function FilmField({ className, progress }: { className?: string; progress: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }));
    scene.add(mesh);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onMove = (e: PointerEvent) => {
      uniforms.uMouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = false;

    const tick = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      const target = progressRef.current;
      uniforms.uProgress.value += (target - uniforms.uProgress.value) * 0.12;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduce) tick();
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(host);

    if (reduce) {
      uniforms.uProgress.value = 0.5;
      uniforms.uTime.value = 8;
      renderer.render(scene, camera);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
