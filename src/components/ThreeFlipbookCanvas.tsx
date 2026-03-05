import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FlipbookPage } from "../types/domain";
import { withBasePath } from "../lib/assetPaths";
import { getModelLinkByPageId, getModelUrl } from "../data/modelRegistry";

type ThreeFlipbookCanvasProps = {
  page: FlipbookPage;
  currentIndex: number;
  totalPages: number;
  canAdvance: boolean;
  triggerFinalClose: boolean;
  onRequestNext: () => void;
  onRequestPrev: () => void;
  onFinalCloseComplete: () => void;
  compact?: boolean;
};

export function ThreeFlipbookCanvas({
  page,
  currentIndex,
  totalPages,
  canAdvance,
  triggerFinalClose,
  onRequestNext,
  onRequestPrev,
  onFinalCloseComplete,
  compact = false
}: ThreeFlipbookCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const pageTextureRef = useRef<THREE.Texture | null>(null);
  const bookBackgroundRef = useRef<THREE.Mesh | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [statusMessage, setStatusMessage] = useState("Memuat renderer 3D...");

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) {
      setStatus("error");
      setStatusMessage("Container tidak tersedia.");
      return;
    }

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xdfecff);
      sceneRef.current = scene;

      // Camera setup
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 1.8, 6);
      camera.rotation.order = "YXZ";
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
      directionalLight.position.set(-8, 8, 8);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Model group for 3D popup
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);
      modelGroupRef.current = modelGroup;

      // Book background (white page)
      const pageGeometry = new THREE.PlaneGeometry(6, 8);
      const pageMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0
      });
      const pageBackground = new THREE.Mesh(pageGeometry, pageMaterial);
      pageBackground.position.z = -0.5;
      pageBackground.castShadow = true;
      pageBackground.receiveShadow = true;
      scene.add(pageBackground);
      bookBackgroundRef.current = pageBackground;

      // Orbit controls for rotation
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1;
      controls.target.set(0, 1, 0);
      controls.update();
      controlsRef.current = controls;

      // Handle swipe input
      let pointerDown = false;
      let pointerStartX = 0;
      const swipeThreshold = 64;

      const handlePointerDown = (e: PointerEvent) => {
        pointerDown = true;
        pointerStartX = e.clientX;
      };

      const handlePointerUp = (e: PointerEvent) => {
        if (!pointerDown) return;
        pointerDown = false;

        const delta = e.clientX - pointerStartX;
        if (Math.abs(delta) < swipeThreshold) return;

        if (delta < 0) {
          // Swipe left -> next page
          if (canAdvance) onRequestNext();
        } else {
          // Swipe right -> prev page
          onRequestPrev();
        }
      };

      renderer.domElement.addEventListener("pointerdown", handlePointerDown);
      renderer.domElement.addEventListener("pointerup", handlePointerUp);

      // Animation loop
      const animationFrameId = requestAnimationFrame(function animate() {
        requestAnimationFrame(animate);
        if (controlsRef.current) {
          controlsRef.current.update();
        }
        renderer.render(scene, camera);
      });

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;

        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, newHeight);
      };

      window.addEventListener("resize", handleResize);

      setStatus("ready");
      setStatusMessage("3D renderer siap.");

      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
        renderer.domElement.removeEventListener("pointerup", handlePointerUp);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
        if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      setStatus("error");
      setStatusMessage(`Error: ${error instanceof Error ? error.message : "Gagal inisialisasi 3D renderer"}`);
    }
  }, []);

  // Load and display page texture (flipbook page image)
  useEffect(() => {
    if (status !== "ready" || !page.pageTexture) return;

    const textureLoader = new THREE.TextureLoader();
    const texturePath = withBasePath(page.pageTexture);

    textureLoader.load(
      texturePath,
      (texture) => {
        if (bookBackgroundRef.current && bookBackgroundRef.current.material instanceof THREE.MeshStandardMaterial) {
          const material = bookBackgroundRef.current.material;
          material.map = texture;
          material.needsUpdate = true;
          pageTextureRef.current = texture;
        }
      },
      undefined,
      (error) => {
        console.warn(`Failed to load page texture: ${texturePath}`, error);
      }
    );
  }, [page.pageTexture, status]);

  // Load 3D model from page or model registry
  useEffect(() => {
    if (status !== "ready") return;

    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const createFallbackModel = (reason: string = "Model unavailable") => {
      if (!modelGroupRef.current) return;

      // Create a sphere with page-themed color
      const fallbackGeometry = new THREE.IcosahedronGeometry(1.2, 4);
      const fallbackMaterial = new THREE.MeshStandardMaterial({
        color: 0x8896b8,
        roughness: 0.6,
        metalness: 0.3,
        wireframe: false
      });
      const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
      fallbackMesh.castShadow = true;
      fallbackMesh.receiveShadow = true;
      fallbackMesh.position.y = 0.8;
      modelGroupRef.current.add(fallbackMesh);
      
      setStatusMessage(`Fallback mode: ${reason}`);
      console.warn(`[ThreeFlipbookCanvas] Showing fallback for page ${page.id}: ${reason}`);
    };

    const loadModel = async () => {
      if (!modelGroupRef.current) return;

      // Clear previous model
      while (modelGroupRef.current.children.length > 0) {
        const child = modelGroupRef.current.children[0];
        modelGroupRef.current.remove(child);
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }

      // Try to get model URL from registry
      const modelLink = await getModelLinkByPageId(page.id);
      const modelUrl = modelLink ? getModelUrl(modelLink) : null;

      if (!modelUrl) {
        if (isMounted) {
          console.warn(`[ThreeFlipbookCanvas] No model URL for page ${page.id}`);
          createFallbackModel("No URL found");
        }
        return;
      }

      console.log(`[ThreeFlipbookCanvas] Loading model from: ${modelUrl}`);
      setStatusMessage(`Memuat model 3D... (${page.id})`);

      const loader = new GLTFLoader();
      
      // Set timeout for model loading (3 seconds)
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn(`[ThreeFlipbookCanvas] Model load timeout for page ${page.id}`);
          createFallbackModel("Load timeout (>3s)");
        }
      }, 3000);

      loader.load(
        modelUrl,
        (gltf: any) => {
          if (timeoutId) clearTimeout(timeoutId);
          if (!isMounted || !modelGroupRef.current) return;

          const model = gltf.scene;

          // Calculate bounding box for proper scaling
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 3 / maxDim; // Scale to fit in 3x3x3 space

          model.scale.multiplyScalar(scale);

          // Center model
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center.multiplyScalar(scale));
          model.position.y = 0.5; // Lift slightly

          // Enable shadows
          model.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          modelGroupRef.current?.add(model);
          setStatusMessage("Model siap.");
          console.log(`[ThreeFlipbookCanvas] Successfully loaded model for page ${page.id}`);
        },
        (progress: any) => {
          if (isMounted) {
            const percent = (progress.loaded / progress.total) * 100;
            setStatusMessage(`Memuat model 3D... ${Math.round(percent)}%`);
          }
        },
        (error: any) => {
          if (timeoutId) clearTimeout(timeoutId);
          if (isMounted) {
            console.error(`[ThreeFlipbookCanvas] Failed to load model from ${modelUrl}:`, error);
            createFallbackModel(`Load failed: ${error.message || "Network error"}`);
          }
        }
      );
    };

    loadModel();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [page.id, status]);

  // Handle final close animation
  useEffect(() => {
    if (status !== "ready" || !triggerFinalClose) return;

    if (controlsRef.current && cameraRef.current) {
      // Reduce rotation speed for final animation
      controlsRef.current.autoRotateSpeed = 0.5;

      // Tilt book
      const duration = 950; // Match Unity final close timing
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (cameraRef.current) {
          cameraRef.current.position.y = 1.8 + progress * 0.15;
          cameraRef.current.rotation.x = (10 * Math.PI) / 180 - progress * (8 * Math.PI) / 180;
        }

        if (modelGroupRef.current) {
          modelGroupRef.current.rotation.z = progress * 0.5;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onFinalCloseComplete();
        }
      };

      animate();
    }
  }, [status, triggerFinalClose, onFinalCloseComplete]);

  const onResetView = () => {
    if (!cameraRef.current || !controlsRef.current) return;

    cameraRef.current.position.set(0, 1.8, 6);
    cameraRef.current.rotation.order = "YXZ";
    cameraRef.current.rotation.x = (10 * Math.PI) / 180;
    cameraRef.current.rotation.y = 0;
    cameraRef.current.rotation.z = 0;
    controlsRef.current.autoRotateSpeed = 1;
    controlsRef.current.target.set(0, 1, 0);
    controlsRef.current.update();
  };

  return (
    <section className={`card unity-stage-card ${compact ? "is-compact" : ""}`}>
      <div className="unity-stage-toolbar">
        <div>
          <p className="eyebrow">Pop-up 3D</p>
          <p className="muted">
            Halaman {currentIndex + 1}/{totalPages}
          </p>
        </div>
        <button type="button" className="btn btn-outline" onClick={onResetView} disabled={status !== "ready"}>
          Reset View
        </button>
      </div>

      <div className="unity-canvas-wrap">
        <div
          id="three-container"
          ref={containerRef}
          className="unity-canvas"
          style={{ width: "100%", height: "100%", minHeight: "400px" }}
        />
        {status !== "ready" && (
          <div className={`unity-status ${status === "error" ? "is-error" : ""}`}>
            <p>{statusMessage}</p>
            {status === "error" && (
              <>
                <p className="muted">Coba refresh page atau periksa console untuk detail error.</p>
              </>
            )}
          </div>
        )}
      </div>

      <p className="muted">
        Geser kiri atau kanan di area 3D untuk membalik halaman, atau gunakan tombol navigasi di bawah.
      </p>
    </section>
  );
}
