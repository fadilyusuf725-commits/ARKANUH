import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FlipbookPage, PopupViewState } from "../types/domain";

type PopupBookStage3DProps = {
  page: FlipbookPage;
};

function PopupObject({ page }: { page: FlipbookPage }) {
  const groupRef = useRef<THREE.Group>(null);
  const startedAtRef = useRef(performance.now());
  const accent = useMemo(() => new THREE.Color(page.popupAccent), [page.popupAccent]);

  useEffect(() => {
    startedAtRef.current = performance.now();
  }, [page.id]);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = performance.now() - startedAtRef.current;
    const progress = Math.min(1, elapsed / 580);
    const eased = 1 - (1 - progress) ** 3;
    const scale = 0.45 + 0.55 * eased;
    const lift = -0.7 + 0.75 * eased;

    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.y = lift;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 2.4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {page.popupTemplate === "ark" && (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2.2, 0.45, 1]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.55, 1.8, 4]} />
            <meshStandardMaterial color="#8fd2ff" />
          </mesh>
        </group>
      )}

      {page.popupTemplate === "rain" && (
        <group>
          <mesh position={[0, 1.08, 0]}>
            <sphereGeometry args={[0.52, 32, 32]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          {[-0.45, -0.15, 0.15, 0.45].map((x) => (
            <mesh key={x} position={[x, 0.45, 0]}>
              <cylinderGeometry args={[0.05, 0.08, 0.52, 16]} />
              <meshStandardMaterial color="#71c7ff" />
            </mesh>
          ))}
        </group>
      )}

      {page.popupTemplate === "mountain" && (
        <group>
          <mesh position={[-0.65, 0.7, 0]}>
            <coneGeometry args={[0.45, 1.15, 4]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <coneGeometry args={[0.6, 1.5, 4]} />
            <meshStandardMaterial color="#71c7ff" />
          </mesh>
          <mesh position={[0.7, 0.62, 0]}>
            <coneGeometry args={[0.38, 1, 4]} />
            <meshStandardMaterial color="#8ed8ff" />
          </mesh>
        </group>
      )}

      {page.popupTemplate === "wave" && (
        <group>
          <mesh position={[-0.55, 0.6, 0]} rotation={[Math.PI / 2, 0.2, 0.2]}>
            <torusGeometry args={[0.42, 0.14, 20, 40, Math.PI]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0.12, 0.82, 0]} rotation={[Math.PI / 2, -0.3, -0.1]}>
            <torusGeometry args={[0.55, 0.16, 20, 40, Math.PI]} />
            <meshStandardMaterial color="#79cdff" />
          </mesh>
        </group>
      )}

      {page.popupTemplate === "light" && (
        <group>
          <mesh position={[0, 0.95, 0]}>
            <icosahedronGeometry args={[0.58, 1]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.45} />
          </mesh>
          <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[0.82, 0.04, 12, 64]} />
            <meshStandardMaterial color="#8ad5ff" />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function PopupBookStage3D({ page }: PopupBookStage3DProps) {
  const controlsRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [viewState, setViewState] = useState<PopupViewState>({
    yaw: 0,
    pitch: 0,
    autoRotate: true
  });

  const autoRotateEnabled = viewState.autoRotate && !isDragging;

  const onResetView = () => {
    controlsRef.current?.reset?.();
    setIsDragging(false);
    setViewState({
      yaw: 0,
      pitch: 0,
      autoRotate: true
    });
  };

  const onControlEnd = () => {
    const yaw = controlsRef.current?.getAzimuthalAngle?.() ?? 0;
    const pitch = controlsRef.current?.getPolarAngle?.() ?? 0;
    setIsDragging(false);
    setViewState((prev) => ({
      ...prev,
      yaw,
      pitch
    }));
  };

  useEffect(() => {
    onResetView();
  }, [page.id]);

  return (
    <section className="card popup-stage-card">
      <div className="popup-stage-toolbar">
        <p className="eyebrow">Pop-up 3D 360</p>
        <button type="button" className="btn btn-outline" onClick={onResetView}>
          Reset View
        </button>
      </div>
      <div className="popup-canvas-wrap">
        <Canvas camera={{ position: [0, 1.2, 4], fov: 38 }}>
          <color attach="background" args={["#dff3ff"]} />
          <ambientLight intensity={0.85} />
          <directionalLight position={[4, 5, 3]} intensity={1.1} />
          <directionalLight position={[-3, 3, -2]} intensity={0.4} />

          <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[3.6, 60]} />
            <meshStandardMaterial color="#bfe7ff" />
          </mesh>

          <PopupObject page={page} />
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={false}
            autoRotate={autoRotateEnabled}
            autoRotateSpeed={0.85}
            minPolarAngle={0.7}
            maxPolarAngle={2.2}
            onStart={() => setIsDragging(true)}
            onEnd={onControlEnd}
          />
        </Canvas>
      </div>
      <p className="muted">
        Drag untuk memutar pop-up 360 derajat. Rotasi otomatis aktif saat tidak disentuh.
      </p>
    </section>
  );
}
