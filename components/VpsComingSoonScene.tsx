
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function VpsComingSoonScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 3);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const resize = () => {
      const w = canvas.clientWidth || 600;
      const h = canvas.clientHeight || 340;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const ambient = new THREE.AmbientLight(0x7dd3fc, 0.6);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0x38bdf8, 0.9);
    dir.position.set(2, 4, 3);
    scene.add(dir);

    // Earth-like sphere
    const earthGeo = new THREE.SphereGeometry(0.8, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.25,
      metalness: 0.6,
      roughness: 0.4,
      wireframe: false
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(-0.5, -0.2, 0);
    scene.add(earth);

    // Satellite body
    const bodyGeo = new THREE.BoxGeometry(0.5, 0.25, 0.25);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      metalness: 0.9,
      roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0.9, 0.4, 0);
    scene.add(body);

    // Solar panels
    const panelGeo = new THREE.BoxGeometry(0.7, 0.08, 0.02);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      metalness: 0.7,
      roughness: 0.3
    });
    const panelLeft = new THREE.Mesh(panelGeo, panelMat);
    const panelRight = new THREE.Mesh(panelGeo, panelMat);
    panelLeft.position.set(0.9 - 0.6, 0.4, 0);
    panelRight.position.set(0.9 + 0.6, 0.4, 0);
    scene.add(panelLeft);
    scene.add(panelRight);

    // Astronaut (simple)
    const astroGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const astroMat = new THREE.MeshStandardMaterial({
      color: 0xf9fafb,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.3
    });
    const astro = new THREE.Mesh(astroGeo, astroMat);
    astro.position.set(0.9, 0.85, 0.15);
    scene.add(astro);

    const group = new THREE.Group();
    group.add(body);
    group.add(panelLeft);
    group.add(panelRight);
    group.add(astro);
    scene.add(group);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 450;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.02 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      earth.rotation.y += 0.0025;
      group.rotation.y += 0.01;
      group.rotation.x = Math.sin(Date.now() * 0.0003) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      earthGeo.dispose();
      bodyGeo.dispose();
      panelGeo.dispose();
      astroGeo.dispose();
      starGeo.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "320px",
        display: "block",
        borderRadius: "1.5rem",
        background:
          "radial-gradient(circle at top, rgba(15,23,42,1), rgba(15,23,42,0.96))",
        boxShadow: "0 28px 80px rgba(15,23,42,1)",
      }}
    />
  );
}
