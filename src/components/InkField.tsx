import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec2 uRes;

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
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 st = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.055;

    vec2 q = st * 1.35;
    q += vec2(fbm(q * 1.2 + t), fbm(q * 1.2 - t)) * 0.55;
    q += (uMouse - 0.5) * 0.55;

    float d = length(q);
    float wave = fbm(q * 2.1 + vec2(t * 0.7, -t * 0.4)) * 1.4;

    // contour lines
    float lines = fract((d + wave) * 13.0 - uScroll * 1.6);
    float line = smoothstep(0.90, 0.995, lines) * smoothstep(0.0, 0.25, lines);
    line *= 1.0 - smoothstep(0.55, 1.35, d);

    // red band: a diagonal sweeping plane
    float band = smoothstep(0.02, 0.0, abs(st.x * 0.7 + st.y * 0.5 - 0.22 + sin(t * 2.0) * 0.06));
    band *= 0.35;

    vec3 paper = vec3(0.043, 0.059, 0.016);
    vec3 ink = vec3(0.909, 0.933, 0.824);
    vec3 lime = vec3(0.784, 0.969, 0.318);

    vec3 col = paper;
    col = mix(col, ink, line * 0.5);
    col = mix(col, lime, band * smoothstep(0.9, 0.2, d) * 0.9);

    // vignette + grain
    float vig = smoothstep(1.25, 0.1, length(st * vec2(0.85, 1.0)));
    col *= mix(1.0, 0.55, 1.0 - vig);
    float g = hash(vUv * uRes + fract(uTime) * 91.0);
    col += (g - 0.5) * 0.035;

    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(lum) * vec3(1.02, 1.0, 0.94), 0.45);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Full-bleed shader field: contour topography that answers to scroll and pointer. */
export default function InkField({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
    };

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms }),
    );
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
      const rect = host.getBoundingClientRect();
      uniforms.uMouse.value.set(
        THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width, 0, 1),
        THREE.MathUtils.clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1),
      );
    };
    const onScroll = () => {
      const rect = host.getBoundingClientRect();
      const progress = THREE.MathUtils.clamp(1 - rect.top / window.innerHeight, 0, 1.4);
      uniforms.uScroll.value = progress;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = false;

    const tick = () => {
      uniforms.uTime.value = clock.getElapsedTime();
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
      uniforms.uTime.value = 12;
      renderer.render(scene, camera);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
