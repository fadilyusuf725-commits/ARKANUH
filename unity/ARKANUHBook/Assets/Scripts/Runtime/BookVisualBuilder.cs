using UnityEngine;

namespace Arkanuh.UnityBridge
{
    public class BookVisualBuilder : MonoBehaviour
    {
        [SerializeField] private Transform stageRoot;
        [SerializeField] private Transform popupRoot;
        [SerializeField] private Renderer backdropRenderer;
        [SerializeField] private Renderer platformRenderer;
        [Header("Template Prefab (Opsional dari Meshy)")]
        [SerializeField] private bool useTemplatePrefabs = true;
        [SerializeField] private bool tintTemplatePrefabs = false;
        [SerializeField] private Vector3 templatePrefabOffset = Vector3.zero;
        [SerializeField] private Vector3 templatePrefabScale = Vector3.one;
        [SerializeField] private GameObject arkPrefab;
        [SerializeField] private GameObject rainPrefab;
        [SerializeField] private GameObject mountainPrefab;
        [SerializeField] private GameObject wavePrefab;
        [SerializeField] private GameObject lightPrefab;

        private GameObject currentPopupObject;
        private TextMesh titleLabel;
        private TextMesh floatingLabel;
        private Light sceneLight;

        // Palet warna yang lebih kaya
        private readonly Color skyBlue = new Color(0.53f, 0.81f, 1f);
        private readonly Color sunsetOrange = new Color(1f, 0.6f, 0.3f);
        private readonly Color nightPurple = new Color(0.29f, 0.18f, 0.42f);
        private readonly Color forestGreen = new Color(0.13f, 0.37f, 0.25f);
        private readonly Color oceanDeep = new Color(0.08f, 0.32f, 0.55f);
        private readonly Color warmYellow = new Color(1f, 0.87f, 0.45f);
        private readonly Color softPink = new Color(0.95f, 0.7f, 0.75f);
        private readonly Color woodBrown = new Color(0.48f, 0.32f, 0.18f);
        private readonly Color creamWhite = new Color(0.95f, 0.93f, 0.88f);
        private readonly Color darkBrown = new Color(0.28f, 0.18f, 0.1f);

        public void InitializeVisualRig()
        {
            if (stageRoot != null)
            {
                return;
            }

            var root = new GameObject("PopupStageRoot");
            root.transform.SetParent(transform, false);
            root.transform.localPosition = new Vector3(0f, -0.15f, 0f);
            stageRoot = root.transform;

            // Backdrop dengan gradasi warna langit
            var backdrop = GameObject.CreatePrimitive(PrimitiveType.Cube);
            backdrop.name = "Backdrop";
            backdrop.transform.SetParent(stageRoot, false);
            backdrop.transform.localPosition = new Vector3(0f, 0.85f, 1.8f);
            backdrop.transform.localScale = new Vector3(5.2f, 2.8f, 0.08f);
            backdropRenderer = backdrop.GetComponent<Renderer>();
            if (backdropRenderer != null)
            {
                backdropRenderer.material = CreateColorMaterial(backdropRenderer, skyBlue);
            }

            // Platform dengan tekstur kayu
            var platform = GameObject.CreatePrimitive(PrimitiveType.Cube);
            platform.name = "Platform";
            platform.transform.SetParent(stageRoot, false);
            platform.transform.localPosition = new Vector3(0f, 0.05f, 0f);
            platform.transform.localScale = new Vector3(4.9f, 0.16f, 3.1f);
            platformRenderer = platform.GetComponent<Renderer>();
            if (platformRenderer != null)
            {
                platformRenderer.material = CreateColorMaterial(platformRenderer, creamWhite);
            }

            // Elemen platform tambahan - sisi kiri dan kanan
            var leftEdge = GameObject.CreatePrimitive(PrimitiveType.Cube);
            leftEdge.name = "LeftEdge";
            leftEdge.transform.SetParent(stageRoot, false);
            leftEdge.transform.localPosition = new Vector3(-2.3f, 0.12f, 0f);
            leftEdge.transform.localScale = new Vector3(0.35f, 0.3f, 3.1f);
            var leftRenderer = leftEdge.GetComponent<Renderer>();
            if (leftRenderer != null)
            {
                leftRenderer.material = CreateColorMaterial(leftRenderer, woodBrown);
            }

            var rightEdge = GameObject.CreatePrimitive(PrimitiveType.Cube);
            rightEdge.name = "RightEdge";
            rightEdge.transform.SetParent(stageRoot, false);
            rightEdge.transform.localPosition = new Vector3(2.3f, 0.12f, 0f);
            rightEdge.transform.localScale = new Vector3(0.35f, 0.3f, 3.1f);
            var rightRenderer = rightEdge.GetComponent<Renderer>();
            if (rightRenderer != null)
            {
                rightRenderer.material = CreateColorMaterial(rightRenderer, woodBrown);
            }

            // Popup root untuk elemen 3D cerita
            var popup = new GameObject("PopupRoot");
            popup.transform.SetParent(stageRoot, false);
            popup.transform.localPosition = new Vector3(0f, 0.55f, -0.2f);
            popupRoot = popup.transform;

            // Label dengan styling yang lebih baik
            titleLabel = CreateLabel("TitleLabel", new Vector3(0f, 1.95f, 0.4f), 0.38f, TextAnchor.MiddleCenter, "#1a365d");
            floatingLabel = CreateLabel(
                "FloatingLabel",
                new Vector3(0f, -0.75f, -1.3f),
                0.18f,
                TextAnchor.MiddleCenter,
                "#2d4a6f"
            );

            // Setup pencahayaan
            SetupLighting();

            ApplyBackdropColor(skyBlue);
        }

        private void SetupLighting()
        {
            // Ambient light
            var ambientLight = new GameObject("AmbientLight");
            ambientLight.transform.SetParent(stageRoot, false);
            var ambient = ambientLight.AddComponent<Light>();
            ambient.type = LightType.Directional;
            ambient.intensity = 0.6f;
            ambient.color = new Color(1f, 0.95f, 0.9f);
            ambientLight.transform.rotation = Quaternion.Euler(45f, -30f, 0f);

            // Point light untuk highlight
            var highlightLight = new GameObject("HighlightLight");
            highlightLight.transform.SetParent(stageRoot, false);
            highlightLight.transform.localPosition = new Vector3(1.5f, 1.5f, -1f);
            sceneLight = highlightLight.AddComponent<Light>();
            sceneLight.type = LightType.Point;
            sceneLight.intensity = 0.8f;
            sceneLight.range = 8f;
            sceneLight.color = warmYellow;
        }

        public void ApplyPageVisual(UnityPagePayloadData payload)
        {
            if (payload == null)
            {
                return;
            }

            InitializeVisualRig();
            var accentColor = ParseHex(payload.popupAccent);

            // Gradasi backdrop berdasarkan tema cerita
            Color backdropColor;
            Color platformColor;
            
            switch (payload.popupTemplate)
            {
                case "rain":
                    backdropColor = Color.Lerp(new Color(0.6f, 0.65f, 0.75f), accentColor, 0.4f);
                    platformColor = new Color(0.45f, 0.5f, 0.55f);
                    break;
                case "mountain":
                    backdropColor = Color.Lerp(new Color(0.7f, 0.8f, 0.9f), accentColor, 0.35f);
                    platformColor = new Color(0.5f, 0.55f, 0.5f);
                    break;
                case "wave":
                    backdropColor = Color.Lerp(oceanDeep, accentColor, 0.4f);
                    platformColor = new Color(0.3f, 0.5f, 0.6f);
                    break;
                case "light":
                    backdropColor = Color.Lerp(new Color(0.95f, 0.9f, 0.7f), accentColor, 0.3f);
                    platformColor = creamWhite;
                    break;
                default: // ark
                    backdropColor = Color.Lerp(skyBlue, accentColor, 0.35f);
                    platformColor = creamWhite;
                    break;
            }

            ApplyBackdropColor(backdropColor);
            ApplyPlatformColor(platformColor);

            if (titleLabel != null)
            {
                titleLabel.text = payload.title;
            }

            if (floatingLabel != null)
            {
                floatingLabel.text = payload.floatingText;
            }

            RebuildPopup(payload.popupTemplate, accentColor);
        }

        private void ApplyPlatformColor(Color color)
        {
            if (platformRenderer != null && platformRenderer.material != null)
            {
                SetMaterialColor(platformRenderer.material, color);
            }
        }

        public void ApplyBookTransform(float lift, float tilt)
        {
            if (stageRoot == null)
            {
                return;
            }

            stageRoot.localPosition = new Vector3(0f, -0.15f + lift, 0f);
            stageRoot.localRotation = Quaternion.Euler(tilt, 0f, 0f);
        }

        public void SetFlipProgress(float progress)
        {
            if (popupRoot == null)
            {
                return;
            }

            var clamped = Mathf.Clamp01(progress);
            popupRoot.localRotation = Quaternion.Euler(0f, Mathf.Lerp(-12f, 12f, clamped), 0f);
            popupRoot.localScale = Vector3.one * Mathf.Lerp(0.9f, 1.05f, Mathf.Sin(clamped * Mathf.PI));
        }

        public void SetPopupSpin(float yaw)
        {
            if (currentPopupObject == null)
            {
                return;
            }
            currentPopupObject.transform.localRotation = Quaternion.Euler(0f, yaw, 0f);
        }

        private void RebuildPopup(string template, Color accent)
        {
            if (currentPopupObject != null)
            {
                Destroy(currentPopupObject);
            }

            currentPopupObject = new GameObject("PopupObject");
            currentPopupObject.transform.SetParent(popupRoot, false);
            currentPopupObject.transform.localPosition = Vector3.zero;

            if (TrySpawnTemplatePrefab(template, accent))
            {
                return;
            }

            switch (template)
            {
                case "rain":
                    BuildRainScene(currentPopupObject.transform, accent);
                    break;
                case "mountain":
                    BuildMountainScene(currentPopupObject.transform, accent);
                    break;
                case "wave":
                    BuildWaveScene(currentPopupObject.transform, accent);
                    break;
                case "light":
                    BuildLightScene(currentPopupObject.transform, accent);
                    break;
                default:
                    BuildArkScene(currentPopupObject.transform, accent);
                    break;
            }
        }

        private bool TrySpawnTemplatePrefab(string template, Color accent)
        {
            if (!useTemplatePrefabs)
            {
                return false;
            }

            var prefab = GetTemplatePrefab(template);
            if (prefab == null)
            {
                return false;
            }

            var instance = Instantiate(prefab, currentPopupObject.transform, false);
            instance.name = $"Template_{template}";
            instance.transform.localPosition = templatePrefabOffset;
            instance.transform.localRotation = Quaternion.identity;
            instance.transform.localScale = templatePrefabScale;

            if (tintTemplatePrefabs)
            {
                ApplyTintToHierarchy(instance.transform, accent);
            }

            return true;
        }

        private GameObject GetTemplatePrefab(string template)
        {
            switch (template)
            {
                case "rain":
                    return rainPrefab;
                case "mountain":
                    return mountainPrefab;
                case "wave":
                    return wavePrefab;
                case "light":
                    return lightPrefab;
                default:
                    return arkPrefab;
            }
        }

        private static void ApplyTintToHierarchy(Transform root, Color tintColor)
        {
            if (root == null)
            {
                return;
            }

            var propertyBlock = new MaterialPropertyBlock();
            var renderers = root.GetComponentsInChildren<Renderer>(true);
            foreach (var renderer in renderers)
            {
                if (renderer == null || renderer.sharedMaterial == null)
                {
                    continue;
                }

                if (renderer.sharedMaterial.HasProperty("_BaseColor"))
                {
                    propertyBlock.SetColor("_BaseColor", tintColor);
                    renderer.SetPropertyBlock(propertyBlock);
                    continue;
                }

                if (renderer.sharedMaterial.HasProperty("_Color"))
                {
                    propertyBlock.SetColor("_Color", tintColor);
                    renderer.SetPropertyBlock(propertyBlock);
                }
            }
        }

        // ===== KAPAL NABI NUH (ARK) =====
        private void BuildArkScene(Transform root, Color accent)
        {
            // Badan kapal utama (hull) - bagian bawah
            var hullBottom = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(0f, -0.05f, 0f),
                new Vector3(1.9f, 0.42f, 0.95f),
                woodBrown
            );
            hullBottom.name = "HullBottom";

            // Badan kapal atas
            var hullTop = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(0f, 0.18f, 0f),
                new Vector3(1.7f, 0.28f, 0.8f),
                darkBrown
            );
            hullTop.name = "HullTop";

            // Lengkungan kapal (depan) - нос (bow)
            var bow = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(0f, 0.08f, 0.55f),
                new Vector3(0.5f, 0.5f, 0.5f),
                woodBrown
            );
            bow.name = "Bow";
            bow.transform.localScale = new Vector3(1.2f, 0.4f, 0.6f);

            // Lengkungan kapal (belakang) - корма (stern)
            var stern = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(0f, 0.08f, -0.55f),
                new Vector3(0.5f, 0.5f, 0.5f),
                woodBrown
            );
            stern.name = "Stern";
            stern.transform.localScale = new Vector3(1.2f, 0.4f, 0.6f);

            // Tiang kapal utama (mast) - мачта
            var mast = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(0f, 0.75f, 0f),
                new Vector3(0.07f, 0.9f, 0.07f),
                darkBrown
            );
            mast.name = "Mast";

            // Layar kapal utama (main sail) - парус
            var sailMain = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(0.25f, 0.72f, 0f),
                new Vector3(0.5f, 0.55f, 0.03f),
                creamWhite
            );
            sailMain.name = "SailMain";

            // Layar kecil di depan (front sail)
            var sailFront = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(0.6f, 0.4f, 0f),
                new Vector3(0.25f, 0.3f, 0.02f),
                softPink
            );
            sailFront.name = "SailFront";

            // Dek kapal (палуба)
            var deck = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(0f, 0.32f, 0f),
                new Vector3(1.5f, 0.04f, 0.7f),
                woodBrown
            );
            deck.name = "Deck";

            // Pagar kapal kiri (левый борт)
            var leftRail = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(-0.7f, 0.45f, 0f),
                new Vector3(0.03f, 0.2f, 0.7f),
                darkBrown
            );
            leftRail.name = "LeftRail";

            // Pagar kapal kanan (правый борт)
            var rightRail = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(0.7f, 0.45f, 0f),
                new Vector3(0.03f, 0.2f, 0.7f),
                darkBrown
            );
            rightRail.name = "RightRail";

            // Tiupan angin - ветер (garis-garis angin)
            for (int i = 0; i < 3; i++)
            {
                var windLine = CreatePrimitive(
                    PrimitiveType.Cylinder,
                    root,
                    new Vector3(-0.9f - (i * 0.15f), 0.5f + (i * 0.1f), 0.3f - (i * 0.1f)),
                    new Vector3(0.3f, 0.015f, 0.015f),
                    new Color(0.75f, 0.85f, 0.95f, 0.5f)
                );
                windLine.transform.localRotation = Quaternion.Euler(0f, 0f, 15f + (i * 5));
                windLine.name = $"Wind_{i}";
            }

            // Tambah detail: jendela kapal
            for (int i = -1; i <= 1; i++)
            {
                var window = CreatePrimitive(
                    PrimitiveType.Sphere,
                    root,
                    new Vector3(i * 0.35f, 0.18f, 0.42f),
                    new Vector3(0.08f, 0.08f, 0.03f),
                    new Color(0.6f, 0.75f, 0.9f, 0.8f)
                );
                window.name = $"Window_{i}";
            }

            // Tambah detail: tali kapal
            var rope1 = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(0.03f, 0.55f, 0.1f),
                new Vector3(0.015f, 0.5f, 0.015f),
                new Color(0.6f, 0.5f, 0.35f)
            );
            rope1.name = "Rope1";

            var rope2 = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(-0.03f, 0.55f, -0.1f),
                new Vector3(0.015f, 0.5f, 0.015f),
                new Color(0.6f, 0.5f, 0.35f)
            );
            rope2.name = "Rope2";
        }

        // ===== SCENE HUJAN (KAUM MENOLAK) =====
        private void BuildRainScene(Transform root, Color accent)
        {
            // Awan utama - beberapa sphere digabungkan
            var cloud1 = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(-0.3f, 0.55f, 0f),
                new Vector3(1.0f, 0.6f, 0.7f),
                new Color(0.65f, 0.68f, 0.75f)
            );
            cloud1.name = "Cloud1";

            var cloud2 = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(0.2f, 0.6f, 0.1f),
                new Vector3(0.8f, 0.5f, 0.6f),
                new Color(0.6f, 0.63f, 0.7f)
            );
            cloud2.name = "Cloud2";

            var cloud3 = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(0.5f, 0.5f, -0.1f),
                new Vector3(0.6f, 0.45f, 0.5f),
                new Color(0.55f, 0.58f, 0.65f)
            );
            cloud3.name = "Cloud3";

            // Petir (lightning) - garis kuning
            var lightning = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(0.1f, 0.2f, 0.2f),
                new Vector3(0.04f, 0.5f, 0.04f),
                warmYellow
            );
            lightning.transform.localRotation = Quaternion.Euler(0f, 0f, 25f);
            lightning.name = "Lightning";

            // Tetesan hujan
            for (int i = -3; i <= 3; i++)
            {
                var drop = CreatePrimitive(
                    PrimitiveType.Cylinder,
                    root,
                    new Vector3(i * 0.18f, -0.1f + Mathf.Abs(i) * 0.05f, 0f),
                    new Vector3(0.03f, 0.15f, 0.03f),
                    new Color(0.5f, 0.7f, 0.95f, 0.7f)
                );
                drop.name = $"Rain_{i}";
            }

            // Permukaan air/suram
            var waterSurface = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(0f, -0.35f, 0f),
                new Vector3(2.0f, 0.08f, 1.0f),
                new Color(0.35f, 0.4f, 0.5f)
            );
            waterSurface.name = "WaterSurface";
        }

        // ===== SCENE MOUNTAIN (GUNUNG) =====
        private void BuildMountainScene(Transform root, Color accent)
        {
            // Gunung utama (depan) - menggunakan Capsule
            var mountain1 = CreatePrimitive(
                PrimitiveType.Capsule,
                root,
                new Vector3(0f, 0.28f, 0f),
                new Vector3(1.2f, 0.9f, 0.8f),
                accent
            );
            mountain1.name = "MountainMain";

            // Puncak gunung bersalju - Sphere di atas
            var snowCap = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(0f, 0.72f, 0f),
                new Vector3(0.5f, 0.4f, 0.45f),
                creamWhite
            );
            snowCap.name = "SnowCap";

            // Gunung kecil (kiri) - menggunakan Capsule
            var mountainLeft = CreatePrimitive(
                PrimitiveType.Capsule,
                root,
                new Vector3(-0.9f, 0.15f, 0.15f),
                new Vector3(0.7f, 0.55f, 0.5f),
                new Color(0.5f, 0.65f, 0.55f)
            );
            mountainLeft.name = "MountainLeft";

            // Gunung kecil (kanan) - menggunakan Capsule
            var mountainRight = CreatePrimitive(
                PrimitiveType.Capsule,
                root,
                new Vector3(0.85f, 0.1f, -0.1f),
                new Vector3(0.55f, 0.42f, 0.45f),
                new Color(0.45f, 0.6f, 0.5f)
            );
            mountainRight.name = "MountainRight";

            // Pohon di lereng gunung
            var tree1 = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(-0.5f, -0.15f, 0.2f),
                new Vector3(0.08f, 0.2f, 0.08f),
                darkBrown
            );
            tree1.name = "TreeTrunk1";

            var treeLeaves1 = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(-0.5f, 0f, 0.2f),
                new Vector3(0.25f, 0.25f, 0.25f),
                forestGreen
            );
            treeLeaves1.name = "TreeLeaves1";

            // Bukit kecil
            var hill = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(-1.3f, -0.2f, 0.3f),
                new Vector3(0.5f, 0.3f, 0.4f),
                new Color(0.45f, 0.6f, 0.4f)
            );
            hill.name = "Hill";
            hill.transform.localScale = new Vector3(0.6f, 0.25f, 0.45f);
        }

        // ===== SCENE GELOMBANG LAUT (BANJIR) =====
        private void BuildWaveScene(Transform root, Color accent)
        {
            // Gelombang besar di belakang
            var waveBack = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(-0.2f, 0.15f, -0.3f),
                new Vector3(0.6f, 0.25f, 1.4f),
                new Color(0.3f, 0.55f, 0.75f)
            );
            waveBack.transform.localRotation = Quaternion.Euler(0f, 0f, 18f);
            waveBack.name = "WaveBack";

            // Gelombang tengah
            var waveMid = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(0.25f, 0.25f, 0f),
                new Vector3(0.5f, 0.22f, 1.2f),
                accent
            );
            waveMid.transform.localRotation = Quaternion.Euler(0f, 0f, -22f);
            waveMid.name = "WaveMid";

            // Gelombang depan
            var waveFront = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(-0.15f, 0.05f, 0.25f),
                new Vector3(0.4f, 0.18f, 1.0f),
                new Color(0.4f, 0.65f, 0.85f)
            );
            waveFront.transform.localRotation = Quaternion.Euler(0f, 0f, 30f);
            waveFront.name = "WaveFront";

            // Busa/gelembung di puncak gelombang
            var foam1 = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(0.35f, 0.38f, 0.1f),
                new Vector3(0.15f, 0.12f, 0.15f),
                new Color(0.9f, 0.95f, 1f, 0.8f)
            );
            foam1.name = "Foam1";

            var foam2 = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(-0.25f, 0.22f, 0.3f),
                new Vector3(0.12f, 0.1f, 0.12f),
                new Color(0.85f, 0.92f, 1f, 0.7f)
            );
            foam2.name = "Foam2";

            // Percikan air
            for (int i = 0; i < 5; i++)
            {
                var splash = CreatePrimitive(
                    PrimitiveType.Sphere,
                    root,
                    new Vector3(-0.3f + (i * 0.15f), 0.45f + (i % 2) * 0.08f, 0.15f - (i * 0.05f)),
                    new Vector3(0.06f, 0.06f, 0.06f),
                    new Color(0.7f, 0.85f, 1f, 0.6f)
                );
                splash.name = $"Splash_{i}";
            }
        }

        // ===== SCENE CAHAYA (KETEGUHAN/IMAN) =====
        private void BuildLightScene(Transform root, Color accent)
        {
            // ORB cahaya utama (pusat)
            var orbMain = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(0f, 0.45f, 0f),
                new Vector3(0.7f, 0.7f, 0.7f),
                accent
            );
            orbMain.name = "OrbMain";

            // Tambahkan komponen cahaya
            var glowMain = orbMain.AddComponent<Light>();
            glowMain.type = LightType.Point;
            glowMain.range = 6f;
            glowMain.intensity = 2.0f;
            glowMain.color = accent;

            // Lingkaran cahaya di sekeliling orb
            var ringOuter = CreatePrimitive(
                PrimitiveType.Sphere,
                root,
                new Vector3(0f, 0.45f, 0f),
                new Vector3(1.1f, 1.1f, 1.1f),
                new Color(1f, 1f, 1f, 0.15f)
            );
            ringOuter.name = "RingOuter";

            // Sinar ke atas
            var rayUp = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(0f, 1.0f, 0f),
                new Vector3(0.15f, 0.6f, 0.15f),
                new Color(1f, 0.95f, 0.8f, 0.4f)
            );
            rayUp.name = "RayUp";

            // Sinar ke kiri dan kanan
            var rayLeft = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(-0.5f, 0.45f, 0f),
                new Vector3(0.08f, 0.4f, 0.08f),
                new Color(1f, 0.95f, 0.8f, 0.3f)
            );
            rayLeft.transform.localRotation = Quaternion.Euler(0f, 0f, 90f);
            rayLeft.name = "RayLeft";

            var rayRight = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(0.5f, 0.45f, 0f),
                new Vector3(0.08f, 0.4f, 0.08f),
                new Color(1f, 0.95f, 0.8f, 0.3f)
            );
            rayRight.transform.localRotation = Quaternion.Euler(0f, 0f, -90f);
            rayRight.name = "RayRight";

            // Partikel/partikel cahaya kecil
            for (int i = 0; i < 8; i++)
            {
                float angle = i * Mathf.PI * 2f / 8f;
                var particle = CreatePrimitive(
                    PrimitiveType.Sphere,
                    root,
                    new Vector3(Mathf.Cos(angle) * 0.65f, 0.45f + Mathf.Sin(angle) * 0.15f, Mathf.Sin(angle) * 0.65f),
                    new Vector3(0.08f, 0.08f, 0.08f),
                    new Color(1f, 0.98f, 0.9f, 0.7f)
                );
                particle.name = $"Particle_{i}";
            }

            // Dasar/platform bercahaya
            var glowBase = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(0f, -0.1f, 0f),
                new Vector3(0.9f, 0.08f, 0.9f),
                new Color(1f, 0.95f, 0.85f, 0.25f)
            );
            glowBase.name = "GlowBase";
        }

        private static TextMesh CreateLabel(string name, Vector3 localPosition, float size, TextAnchor anchor, string colorHex)
        {
            var go = new GameObject(name);
            var text = go.AddComponent<TextMesh>();
            text.anchor = anchor;
            text.alignment = TextAlignment.Center;
            text.fontSize = 72;
            text.characterSize = size * 0.08f;
            text.color = ParseHex(colorHex);
            go.transform.localPosition = localPosition;
            return text;
        }

        private static GameObject CreatePrimitive(PrimitiveType type, Transform parent, Vector3 position, Vector3 scale, Color color)
        {
            var primitive = GameObject.CreatePrimitive(type);
            primitive.transform.SetParent(parent, false);
            primitive.transform.localPosition = position;
            primitive.transform.localScale = scale;

            var renderer = primitive.GetComponent<Renderer>();
            if (renderer != null)
            {
                renderer.material = CreateColorMaterial(renderer, color);
            }

            return primitive;
        }

        private void ApplyBackdropColor(Color color)
        {
            if (backdropRenderer != null && backdropRenderer.material != null)
            {
                SetMaterialColor(backdropRenderer.material, color);
            }
        }

        private static Material CreateColorMaterial(Renderer renderer, Color color)
        {
            var baseMaterial = renderer != null ? renderer.sharedMaterial : null;
            Material material;
            if (baseMaterial != null)
            {
                material = new Material(baseMaterial);
            }
            else
            {
                var fallbackShader = ResolveFallbackShader();
                if (fallbackShader == null)
                {
                    Debug.LogWarning("Fallback shader tidak ditemukan. Material default dipakai.");
                    material = new Material(Shader.Find("Standard"));
                }
                else
                {
                    material = new Material(fallbackShader);
                }
            }

            SetMaterialColor(material, color);
            return material;
        }

        private static Shader ResolveFallbackShader()
        {
            return Shader.Find("Universal Render Pipeline/Lit")
                ?? Shader.Find("Universal Render Pipeline/Simple Lit")
                ?? Shader.Find("Standard")
                ?? Shader.Find("Legacy Shaders/Diffuse")
                ?? Shader.Find("Unlit/Color")
                ?? Shader.Find("Sprites/Default");
        }

        private static void SetMaterialColor(Material material, Color color)
        {
            if (material == null)
            {
                return;
            }

            if (material.HasProperty("_BaseColor"))
            {
                material.SetColor("_BaseColor", color);
            }
            else if (material.HasProperty("_Color"))
            {
                material.SetColor("_Color", color);
            }
        }

        private static Color ParseHex(string hex)
        {
            if (!string.IsNullOrWhiteSpace(hex) && ColorUtility.TryParseHtmlString(hex, out var parsed))
            {
                return parsed;
            }
            return new Color(0.18f, 0.61f, 1f);
        }
    }
}
