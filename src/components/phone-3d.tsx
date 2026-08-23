"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { brand } from "@/lib/brand";

export default function Phone3D() {
  const tNav = useTranslations("Nav");
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const phone = brand.phone;
  const phoneLink = phone.replace(/\./g, "");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobileView = window.innerWidth < 768;
    const canvasW = isMobileView ? 180 : 280;
    const canvasH = isMobileView ? 240 : 350;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, canvasW / canvasH, 0.01, 100);
    camera.position.set(0, 0.5, 2.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobileView });
    renderer.setSize(canvasW, canvasH);
    renderer.setPixelRatio(isMobileView ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xC9A961, 1.5);
    keyLight.position.set(3, 5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xE0C68A, 1);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    // Load GLB
    const loader = new GLTFLoader();
    let model: THREE.Group | null = null;
    let pivot: THREE.Group | null = null;

    loader.load("/phone.glb", (gltf) => {
      model = gltf.scene;

      // Pivot group for Y rotation
      pivot = new THREE.Group();
      pivot.add(model);
      scene.add(pivot);

      // Compute bounding box
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());

      // Scale to target height
      const targetHeight = 0.25;
      const scale = targetHeight / size.y;
      model.scale.setScalar(scale);

      // Recompute after scale and center
      const box2 = new THREE.Box3().setFromObject(model);
      const center2 = box2.getCenter(new THREE.Vector3());
      model.position.x = -center2.x;
      model.position.z = -center2.z;
      model.position.y = -box2.min.y;

      pivot.position.y = -0.2;
      (pivot as any).baseY = pivot.position.y;
    }, undefined, (error) => {
      console.error("Error loading phone.glb:", error);
    });

    // Scroll + mouse
    let targetRotationY = 0;
    let currentRotationY = 0;
    let mouseX = 0, mouseY = 0, parX = 0, parY = 0;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      targetRotationY = max > 0 ? (window.scrollY / max) * Math.PI * 3 : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      parX += (mouseX - parX) * 0.05;
      parY += (mouseY - parY) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      if (pivot) {
        pivot.rotation.y = currentRotationY + parX * 0.3;
        pivot.position.y = (pivot as any).baseY + Math.sin(time * 1.2) * 0.05;
      }

      camera.position.x = parX * 0.3;
      camera.position.y = 0.6 - parY * 0.2;
      camera.lookAt(0, 0.5, 0);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {};
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <div
      className="fixed bottom-0 right-0 z-40 pointer-events-none"
      style={{ right: isMobile ? "5px" : "0px" }}
    >
    <div className="animate-pop-in">
      <div ref={mountRef} className="w-[180px] h-[240px] md:w-[280px] md:h-[350px] relative" style={{ opacity: 0.85 }}>
        {/* Speech bubble — centered above phone */}
        <div className="absolute top-[110px] md:top-[160px] left-1/2 -translate-x-1/2 bg-white rounded-2xl px-3 py-2 md:px-5 md:py-3 shadow-2xl z-10 animate-bubble-pop whitespace-nowrap max-w-[170px] md:max-w-none overflow-hidden">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
          <p className="font-display text-xs md:text-sm text-black font-semibold text-center">{tNav("bookByPhone")}</p>
          <a href={`tel:${phoneLink}`} className="text-black text-sm md:text-lg font-bold block text-center pointer-events-auto hover:text-gold transition-colors">{phone}</a>
        </div>
      </div>
    </div>
    </div>
  );
}
