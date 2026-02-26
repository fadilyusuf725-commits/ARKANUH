import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BookAnimState, FlipbookPage, PopupViewState } from "../types/domain";

const INTRO_STORAGE_KEY = "arkanuh_v3_book_intro_seen";
const COVER_INTRO_MS = 900;
const DROP_IN_MS = 900;
const FLIP_MS = 620;
const FINAL_CLOSE_MS = 1850;

type BookSceneCanvasProps = {
  page: FlipbookPage;
  currentIndex: number;
  totalPages: number;
  triggerFinalClose: boolean;
  onFinalCloseComplete: () => void;
};

type BookModelProps = {
  page: FlipbookPage;
  currentIndex: number;
  totalPages: number;
  animState: BookAnimState;
  flipDirection: 1 | -1;
  popupTick: number;
  allowIdleSpin: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function easeOutBack(value: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (value - 1) ** 3 + c1 * (value - 1) ** 2;
}

function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }
  return 1 - (-2 * value + 2) ** 3 / 2;
}

function PopupTemplate({ page }: { page: FlipbookPage }) {
  const accent = page.popupAccent;

  if (page.popupTemplate === "ark") {
    return (
      <group>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[1.5, 0.22, 0.62]} />
          <meshStandardMaterial color={accent} roughness={0.52} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[0.65, 0.2, 0.5]} />
          <meshStandardMaterial color="#f9fdff" roughness={0.4} metalness={0.03} />
        </mesh>
        <mesh position={[0, 0.73, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.45, 18]} />
          <meshStandardMaterial color="#785b2e" roughness={0.72} />
        </mesh>
        <mesh position={[0.18, 0.73, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.38, 4]} />
          <meshStandardMaterial color="#d6efff" roughness={0.5} metalness={0.04} />
        </mesh>
        {[-0.52, -0.2, 0.12, 0.45].map((x) => (
          <mesh key={x} position={[x, -0.02, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.17, 0.045, 12, 30, Math.PI]} />
            <meshStandardMaterial color="#70c6ff" roughness={0.38} metalness={0.05} />
          </mesh>
        ))}
      </group>
    );
  }

  if (page.popupTemplate === "rain") {
    return (
      <group>
        <group position={[0, 0.64, 0]}>
          {[-0.35, -0.12, 0.12, 0.34].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <sphereGeometry args={[0.2, 24, 24]} />
              <meshStandardMaterial color={accent} roughness={0.4} metalness={0.05} />
            </mesh>
          ))}
        </group>
        {[-0.42, -0.2, 0, 0.2, 0.42].map((x) => (
          <mesh key={x} position={[x, 0.22, 0]}>
            <coneGeometry args={[0.045, 0.22, 12]} />
            <meshStandardMaterial color="#8ed8ff" roughness={0.24} metalness={0.08} />
          </mesh>
        ))}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.48, 36]} />
          <meshStandardMaterial color="#a6e3ff" roughness={0.34} metalness={0.04} />
        </mesh>
      </group>
    );
  }

  if (page.popupTemplate === "mountain") {
    return (
      <group>
        <mesh position={[-0.44, 0.35, 0]}>
          <coneGeometry args={[0.33, 0.76, 5]} />
          <meshStandardMaterial color={accent} roughness={0.6} metalness={0.05} />
        </mesh>
        <mesh position={[0.06, 0.46, 0]}>
          <coneGeometry args={[0.44, 0.96, 5]} />
          <meshStandardMaterial color="#6cbff8" roughness={0.56} metalness={0.05} />
        </mesh>
        <mesh position={[0.52, 0.3, 0]}>
          <coneGeometry args={[0.28, 0.66, 5]} />
          <meshStandardMaterial color="#94dcff" roughness={0.56} metalness={0.05} />
        </mesh>
        {[-0.52, -0.3, -0.08, 0.18, 0.38].map((x) => (
          <group key={x} position={[x, 0.12, 0.22]}>
            <mesh position={[0, 0.09, 0]}>
              <coneGeometry args={[0.06, 0.16, 8]} />
              <meshStandardMaterial color="#2b9553" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.01, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
              <meshStandardMaterial color="#7e5c39" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (page.popupTemplate === "wave") {
    return (
      <group>
        {[-0.62, -0.2, 0.24].map((x, index) => (
          <mesh
            key={x}
            position={[x, 0.18 + index * 0.1, 0]}
            rotation={[Math.PI / 2, 0.2 - index * 0.2, 0.18 - index * 0.15]}
          >
            <torusGeometry args={[0.3 + index * 0.1, 0.08, 16, 42, Math.PI]} />
            <meshStandardMaterial color={index === 0 ? accent : "#79ceff"} roughness={0.34} metalness={0.08} />
          </mesh>
        ))}
        <mesh position={[0.56, 0.32, 0.02]}>
          <boxGeometry args={[0.32, 0.1, 0.22]} />
          <meshStandardMaterial color="#ffe6a7" roughness={0.5} metalness={0.02} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[0, 0.44, 0]}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.48} roughness={0.16} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.03, 10, 80]} />
        <meshStandardMaterial color="#8bd7ff" roughness={0.22} metalness={0.12} />
      </mesh>
      {new Array(12).fill(0).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.72, 0.42 + Math.sin(angle * 2) * 0.04, Math.sin(angle) * 0.26]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#e8f8ff" roughness={0.3} metalness={0.12} />
          </mesh>
        );
      })}
    </group>
  );
}

function BookModel({ page, currentIndex, totalPages, animState, flipDirection, popupTick, allowIdleSpin }: BookModelProps) {
  const bookRef = useRef<THREE.Group>(null);
  const frontCoverRef = useRef<THREE.Group>(null);
  const activePageRef = useRef<THREE.Group>(null);
  const popupRef = useRef<THREE.Group>(null);
  const animStartedAtRef = useRef(performance.now());
  const popupStartedAtRef = useRef(performance.now());

  const pageLabel = useMemo(() => `Halaman ${currentIndex + 1} / ${totalPages}`, [currentIndex, totalPages]);
  const summary = useMemo(() => (page.backCoverSummary ?? []).slice(0, 4), [page.backCoverSummary]);
  const backSummaryText = useMemo(
    () => (summary.length ? `Kesimpulan\n- ${summary.join("\n- ")}` : "Kesimpulan\n- Iman\n- Sabar\n- Taat\n- Jujur"),
    [summary]
  );

  useEffect(() => {
    animStartedAtRef.current = performance.now();
  }, [animState, currentIndex]);

  useEffect(() => {
    popupStartedAtRef.current = performance.now();
  }, [popupTick]);

  useFrame((state, delta) => {
    if (!bookRef.current || !frontCoverRef.current || !activePageRef.current || !popupRef.current) {
      return;
    }

    const stateElapsed = (performance.now() - animStartedAtRef.current) / 1000;
    const popupElapsed = (performance.now() - popupStartedAtRef.current) / 1000;

    let openLevel = 1;
    let dropHeight = 0;
    let flipProgress = 0;
    let standProgress = 0;
    let closeProgress = 0;

    if (animState === "cover_intro") {
      openLevel = 0;
      dropHeight = 0.54;
    } else if (animState === "drop_in") {
      const progress = clamp(stateElapsed / (DROP_IN_MS / 1000), 0, 1);
      dropHeight = THREE.MathUtils.lerp(4.8, 0, easeOutBack(progress));
      openLevel = clamp((progress - 0.28) / 0.72, 0, 1);
    } else if (animState === "flipping") {
      flipProgress = clamp(stateElapsed / (FLIP_MS / 1000), 0, 1);
      openLevel = 1;
    } else if (animState === "final_close") {
      const progress = clamp(stateElapsed / (FINAL_CLOSE_MS / 1000), 0, 1);
      standProgress = easeInOutCubic(clamp((progress - 0.08) / 0.7, 0, 1));
      closeProgress = easeInOutCubic(clamp((progress - 0.36) / 0.58, 0, 1));
      openLevel = 1 - closeProgress;
    }

    const floating = animState === "idle" ? Math.sin(state.clock.elapsedTime * 1.3) * 0.02 : 0;
    bookRef.current.position.set(0, -0.72 + dropHeight + floating, 0);

    if (animState === "final_close") {
      bookRef.current.rotation.set(
        THREE.MathUtils.lerp(-0.12, 1.02, standProgress),
        THREE.MathUtils.lerp(0.16, Math.PI * 0.95, standProgress),
        THREE.MathUtils.lerp(0, -0.52, standProgress)
      );
    } else {
      bookRef.current.rotation.set(-0.12, 0.16, 0);
    }

    frontCoverRef.current.rotation.z = THREE.MathUtils.lerp(0, -2.62, openLevel);

    const flipAngle = Math.sin(flipProgress * Math.PI) * Math.PI * 0.92;
    activePageRef.current.rotation.z = flipDirection === 1 ? -flipAngle : flipAngle;

    const popupIntro = clamp(popupElapsed / 0.56, 0, 1);
    const popupEase = easeOutBack(popupIntro);
    popupRef.current.scale.setScalar(0.56 + 0.44 * popupEase);
    popupRef.current.position.y = 0.32 + (-0.18 * (1 - popupEase) + Math.sin(state.clock.elapsedTime * 2) * 0.02);
    if (allowIdleSpin) {
      popupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group>
      <mesh position={[0, -1.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8.5, 80]} />
        <meshStandardMaterial color="#c7eaff" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0, -1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.4, 6.6, 80]} />
        <meshStandardMaterial color="#9ad7ff" roughness={0.85} metalness={0.05} />
      </mesh>

      <group>
        {[
          [-4.6, 2.1, -3.2],
          [4.4, 2.5, -3.8],
          [-3.2, 2.3, 3.1],
          [3.8, 2, 3.4]
        ].map((position, index) => (
          <group key={index} position={position as [number, number, number]}>
            <mesh position={[-0.3, 0, 0]}>
              <sphereGeometry args={[0.34, 18, 18]} />
              <meshStandardMaterial color="#edf9ff" roughness={0.72} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.44, 22, 22]} />
              <meshStandardMaterial color="#f5fcff" roughness={0.72} />
            </mesh>
            <mesh position={[0.36, 0, 0]}>
              <sphereGeometry args={[0.3, 18, 18]} />
              <meshStandardMaterial color="#edf9ff" roughness={0.72} />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={bookRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.5, 0.12, 3]} />
          <meshStandardMaterial color="#1f85de" roughness={0.42} metalness={0.08} />
        </mesh>
        <mesh position={[0.05, 0.08, 0]}>
          <boxGeometry args={[4.2, 0.1, 2.74]} />
          <meshStandardMaterial color="#f7fcff" roughness={0.52} metalness={0.02} />
        </mesh>

        <group ref={activePageRef} position={[-2.02, 0.17, 0]}>
          <mesh position={[2.02, 0, 0]}>
            <boxGeometry args={[4.04, 0.028, 2.68]} />
            <meshStandardMaterial color="#ffffff" roughness={0.62} metalness={0.01} />
          </mesh>
          <Text
            position={[2.02, 0.024, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            maxWidth={3.55}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            fontSize={0.18}
            color="#0f2f4d"
          >
            {page.title}
          </Text>
          <Text
            position={[2.02, 0.022, 0.9]}
            rotation={[-Math.PI / 2, 0, 0]}
            maxWidth={3.7}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            fontSize={0.1}
            color="#3d6a91"
          >
            {pageLabel}
          </Text>
        </group>

        <group ref={popupRef} position={[0, 0.32, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[1.12, 1.12, 0.04, 40]} />
            <meshStandardMaterial color="#e8f7ff" roughness={0.4} metalness={0.05} />
          </mesh>
          <PopupTemplate page={page} />
        </group>

        <group ref={frontCoverRef} position={[-2.2, 0.13, 0]}>
          <mesh position={[2.2, 0, 0]}>
            <boxGeometry args={[4.4, 0.09, 2.92]} />
            <meshStandardMaterial color="#2f9bff" roughness={0.38} metalness={0.1} />
          </mesh>
          <Text
            position={[2.2, 0.05, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            maxWidth={3.7}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            fontSize={0.22}
            color="#ffffff"
          >
            {page.coverTitle ?? "ARKANUH"}
          </Text>
        </group>

        <group position={[0, -0.02, 0]}>
          <Text
            position={[0, -0.004, -0.72]}
            rotation={[-Math.PI / 2, 0, 0]}
            maxWidth={3.7}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            fontSize={0.12}
            color="#e5f5ff"
          >
            {backSummaryText}
          </Text>
        </group>
      </group>
    </group>
  );
}

export function BookSceneCanvas({ page, currentIndex, totalPages, triggerFinalClose, onFinalCloseComplete }: BookSceneCanvasProps) {
  const controlsRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [viewState, setViewState] = useState<PopupViewState>({
    yaw: 0,
    pitch: 0,
    autoRotate: true
  });
  const [animState, setAnimState] = useState<BookAnimState>("cover_intro");
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);
  const [popupTick, setPopupTick] = useState(0);
  const introDoneRef = useRef(false);
  const finalCloseFiredRef = useRef(false);
  const prevIndexRef = useRef(currentIndex);
  const prevPageIdRef = useRef(page.id);

  useEffect(() => {
    if (typeof window === "undefined") {
      introDoneRef.current = true;
      setAnimState("idle");
      return;
    }

    const seenIntro = window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
    if (seenIntro) {
      introDoneRef.current = true;
      setAnimState("idle");
      return;
    }

    introDoneRef.current = false;
    setAnimState("cover_intro");

    const coverTimeout = window.setTimeout(() => {
      setAnimState("drop_in");
    }, COVER_INTRO_MS);

    const dropTimeout = window.setTimeout(() => {
      introDoneRef.current = true;
      setAnimState("idle");
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    }, COVER_INTRO_MS + DROP_IN_MS);

    return () => {
      window.clearTimeout(coverTimeout);
      window.clearTimeout(dropTimeout);
    };
  }, []);

  useEffect(() => {
    if (prevPageIdRef.current === page.id) {
      return;
    }

    setPopupTick((value) => value + 1);
    setFlipDirection(currentIndex >= prevIndexRef.current ? 1 : -1);

    prevPageIdRef.current = page.id;
    prevIndexRef.current = currentIndex;

    if (!introDoneRef.current || triggerFinalClose) {
      return;
    }

    setAnimState("flipping");
    const flipTimeout = window.setTimeout(() => {
      setAnimState("idle");
    }, FLIP_MS);

    return () => {
      window.clearTimeout(flipTimeout);
    };
  }, [currentIndex, page.id, triggerFinalClose]);

  useEffect(() => {
    if (!triggerFinalClose) {
      finalCloseFiredRef.current = false;
      return;
    }

    setAnimState("final_close");
    const timeout = window.setTimeout(() => {
      if (finalCloseFiredRef.current) {
        return;
      }
      finalCloseFiredRef.current = true;
      onFinalCloseComplete();
    }, FINAL_CLOSE_MS + 120);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onFinalCloseComplete, triggerFinalClose]);

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

  const backCoverSummary = page.backCoverSummary?.slice(0, 4) ?? [];
  const showBackCoverSummary = triggerFinalClose && backCoverSummary.length > 0;

  return (
    <section className="card book-scene-card">
      <div className="book-scene-toolbar">
        <p className="eyebrow">Kanvas 3D Buku Pop-up</p>
        <button type="button" className="btn btn-outline" onClick={onResetView}>
          Reset View
        </button>
      </div>
      <div className="book-scene-wrap">
        <Canvas camera={{ position: [0, 2.2, 7.4], fov: 30 }}>
          <color attach="background" args={["#dff3ff"]} />
          <ambientLight intensity={0.95} />
          <directionalLight position={[6, 8, 4]} intensity={1.1} />
          <directionalLight position={[-4, 5, -3]} intensity={0.48} />
          <pointLight position={[0, 2.8, 0]} intensity={0.26} color="#d8f1ff" />
          <BookModel
            page={page}
            currentIndex={currentIndex}
            totalPages={totalPages}
            animState={animState}
            flipDirection={flipDirection}
            popupTick={popupTick}
            allowIdleSpin={autoRotateEnabled}
          />
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={false}
            minDistance={7.4}
            maxDistance={7.4}
            minPolarAngle={0.68}
            maxPolarAngle={2.28}
            autoRotate={autoRotateEnabled}
            autoRotateSpeed={0.68}
            onStart={() => setIsDragging(true)}
            onEnd={onControlEnd}
          />
        </Canvas>
        {showBackCoverSummary && (
          <div className="back-cover-summary">
            <p className="eyebrow">Kesimpulan</p>
            <ul>
              {backCoverSummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className="muted">Seret kanvas untuk melihat pop-up 360 derajat. Rotasi otomatis aktif saat idle.</p>
    </section>
  );
}
