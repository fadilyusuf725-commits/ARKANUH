using UnityEngine;

namespace Arkanuh.UnityBridge
{
    public class BookVisualBuilder : MonoBehaviour
    {
        [SerializeField] private Transform stageRoot;
        [SerializeField] private Transform popupRoot;
        [SerializeField] private Renderer backdropRenderer;

        private GameObject currentPopupObject;
        private TextMesh titleLabel;
        private TextMesh floatingLabel;

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

            var backdrop = GameObject.CreatePrimitive(PrimitiveType.Cube);
            backdrop.name = "Backdrop";
            backdrop.transform.SetParent(stageRoot, false);
            backdrop.transform.localPosition = new Vector3(0f, 0.85f, 1.8f);
            backdrop.transform.localScale = new Vector3(5.2f, 2.8f, 0.08f);
            backdropRenderer = backdrop.GetComponent<Renderer>();

            var platform = GameObject.CreatePrimitive(PrimitiveType.Cube);
            platform.name = "Platform";
            platform.transform.SetParent(stageRoot, false);
            platform.transform.localPosition = new Vector3(0f, 0.05f, 0f);
            platform.transform.localScale = new Vector3(4.9f, 0.16f, 3.1f);
            var platformRenderer = platform.GetComponent<Renderer>();
            if (platformRenderer != null)
            {
                var platformMaterial = new Material(Shader.Find("Standard"));
                platformMaterial.color = ParseHex("#f5fbff");
                platformRenderer.material = platformMaterial;
            }

            var popup = new GameObject("PopupRoot");
            popup.transform.SetParent(stageRoot, false);
            popup.transform.localPosition = new Vector3(0f, 0.55f, -0.2f);
            popupRoot = popup.transform;

            titleLabel = CreateLabel("TitleLabel", new Vector3(0f, 1.95f, 0.4f), 0.36f, TextAnchor.MiddleCenter, "#0f2f4d");
            floatingLabel = CreateLabel(
                "FloatingLabel",
                new Vector3(0f, -0.85f, -1.3f),
                0.17f,
                TextAnchor.MiddleCenter,
                "#24537f"
            );

            ApplyBackdropColor(ParseHex("#cfeeff"));
        }

        public void ApplyPageVisual(UnityPagePayloadData payload)
        {
            if (payload == null)
            {
                return;
            }

            InitializeVisualRig();
            var accentColor = ParseHex(payload.popupAccent);

            ApplyBackdropColor(Color.Lerp(ParseHex("#dff4ff"), accentColor, 0.35f));

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
            popupRoot.localRotation = Quaternion.Euler(0f, Mathf.Lerp(-8f, 8f, clamped), 0f);
            popupRoot.localScale = Vector3.one * Mathf.Lerp(0.92f, 1.02f, Mathf.Sin(clamped * Mathf.PI));
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

            switch (template)
            {
                case "rain":
                    BuildRainPopup(currentPopupObject.transform, accent);
                    break;
                case "mountain":
                    BuildMountainPopup(currentPopupObject.transform, accent);
                    break;
                case "wave":
                    BuildWavePopup(currentPopupObject.transform, accent);
                    break;
                case "light":
                    BuildLightPopup(currentPopupObject.transform, accent);
                    break;
                default:
                    BuildArkPopup(currentPopupObject.transform, accent);
                    break;
            }
        }

        private void BuildArkPopup(Transform root, Color accent)
        {
            var hull = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(0f, 0.06f, 0f),
                new Vector3(1.85f, 0.36f, 0.88f),
                accent
            );
            hull.name = "Hull";
            var mast = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(0f, 0.68f, 0f),
                new Vector3(0.08f, 0.55f, 0.08f),
                ParseHex("#6a4a2b")
            );
            mast.name = "Mast";
            var sail = CreatePrimitive(
                PrimitiveType.Cube,
                root,
                new Vector3(0.34f, 0.68f, 0f),
                new Vector3(0.58f, 0.42f, 0.04f),
                ParseHex("#d8efff")
            );
            sail.name = "Sail";
        }

        private void BuildRainPopup(Transform root, Color accent)
        {
            var cloud = CreatePrimitive(PrimitiveType.Sphere, root, new Vector3(0f, 0.45f, 0f), new Vector3(1.2f, 0.75f, 0.7f), accent);
            cloud.name = "Cloud";
            for (var i = -2; i <= 2; i++)
            {
                var drop = CreatePrimitive(
                    PrimitiveType.Cylinder,
                    root,
                    new Vector3(i * 0.2f, 0.08f, 0f),
                    new Vector3(0.05f, 0.17f, 0.05f),
                    ParseHex("#7fd0ff")
                );
                drop.name = $"Drop_{i}";
            }
        }

        private void BuildMountainPopup(Transform root, Color accent)
        {
            var mountain = CreatePrimitive(PrimitiveType.Capsule, root, new Vector3(0f, 0.35f, 0f), new Vector3(1.2f, 0.85f, 0.8f), accent);
            mountain.name = "Mountain";
            CreatePrimitive(PrimitiveType.Capsule, root, new Vector3(-0.7f, 0.22f, 0.12f), new Vector3(0.7f, 0.5f, 0.5f), ParseHex("#7cc8f9"));
            CreatePrimitive(PrimitiveType.Capsule, root, new Vector3(0.72f, 0.18f, -0.08f), new Vector3(0.58f, 0.45f, 0.45f), ParseHex("#97dfff"));
        }

        private void BuildWavePopup(Transform root, Color accent)
        {
            var wave1 = CreatePrimitive(PrimitiveType.Cylinder, root, new Vector3(-0.25f, 0.2f, 0f), new Vector3(0.3f, 0.2f, 1.0f), accent);
            wave1.transform.localRotation = Quaternion.Euler(0f, 0f, 24f);
            var wave2 = CreatePrimitive(
                PrimitiveType.Cylinder,
                root,
                new Vector3(0.45f, 0.32f, 0f),
                new Vector3(0.27f, 0.18f, 1.1f),
                ParseHex("#78ccff")
            );
            wave2.transform.localRotation = Quaternion.Euler(0f, 0f, -22f);
        }

        private void BuildLightPopup(Transform root, Color accent)
        {
            var orb = CreatePrimitive(PrimitiveType.Sphere, root, new Vector3(0f, 0.42f, 0f), new Vector3(0.78f, 0.78f, 0.78f), accent);
            orb.name = "LightOrb";

            var glow = orb.AddComponent<Light>();
            glow.type = LightType.Point;
            glow.range = 5f;
            glow.intensity = 1.9f;
            glow.color = accent;
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
                var material = new Material(Shader.Find("Standard"));
                material.color = color;
                renderer.material = material;
            }

            return primitive;
        }

        private void ApplyBackdropColor(Color color)
        {
            if (backdropRenderer != null && backdropRenderer.material != null)
            {
                backdropRenderer.material.color = color;
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
