using UnityEngine;

namespace Arkanuh.UnityBridge
{
    public class BookVisualBuilder : MonoBehaviour
    {
        [SerializeField] private Transform bookRoot;
        [SerializeField] private Transform popupRoot;
        [SerializeField] private Renderer coverRenderer;
        [SerializeField] private Renderer pageRenderer;

        private GameObject currentPopupObject;
        private TextMesh titleLabel;
        private TextMesh floatingLabel;

        public void InitializeVisualRig()
        {
            if (bookRoot != null)
            {
                return;
            }

            var root = new GameObject("BookRoot");
            root.transform.SetParent(transform, false);
            root.transform.localPosition = new Vector3(0f, -0.2f, 0f);
            bookRoot = root.transform;

            var cover = GameObject.CreatePrimitive(PrimitiveType.Cube);
            cover.name = "FrontCover";
            cover.transform.SetParent(bookRoot, false);
            cover.transform.localScale = new Vector3(5.1f, 0.2f, 3.6f);
            cover.transform.localPosition = new Vector3(0f, 0.1f, 0f);
            coverRenderer = cover.GetComponent<Renderer>();

            var page = GameObject.CreatePrimitive(PrimitiveType.Cube);
            page.name = "PageSurface";
            page.transform.SetParent(bookRoot, false);
            page.transform.localScale = new Vector3(4.7f, 0.08f, 3.2f);
            page.transform.localPosition = new Vector3(0f, 0.24f, 0f);
            pageRenderer = page.GetComponent<Renderer>();

            var popup = new GameObject("PopupRoot");
            popup.transform.SetParent(bookRoot, false);
            popup.transform.localPosition = new Vector3(0f, 0.55f, 0f);
            popupRoot = popup.transform;

            titleLabel = CreateLabel("TitleLabel", new Vector3(0f, 0.55f, -2.1f), 0.36f, TextAnchor.MiddleCenter);
            floatingLabel = CreateLabel("FloatingLabel", new Vector3(0f, -1.5f, -2.1f), 0.18f, TextAnchor.MiddleCenter);

            ApplyCoverColor(ParseHex("#2f9bff"));
        }

        public void ApplyPageVisual(UnityPagePayloadData payload)
        {
            if (payload == null)
            {
                return;
            }

            InitializeVisualRig();

            var accentColor = ParseHex(payload.popupAccent);
            ApplyCoverColor(accentColor);

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
            if (bookRoot == null)
            {
                return;
            }

            bookRoot.localPosition = new Vector3(0f, -0.2f + lift, 0f);
            bookRoot.localRotation = Quaternion.Euler(-4f + tilt, 0f, 0f);
        }

        public void SetFlipProgress(float progress)
        {
            if (popupRoot == null)
            {
                return;
            }

            var clamped = Mathf.Clamp01(progress);
            popupRoot.localRotation = Quaternion.Euler(0f, Mathf.Lerp(0f, 170f, clamped), 0f);
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
            var hull = CreatePrimitive(PrimitiveType.Cube, root, new Vector3(0f, 0.05f, 0f), new Vector3(1.8f, 0.35f, 0.9f), accent);
            hull.name = "Hull";
            var mast = CreatePrimitive(PrimitiveType.Cylinder, root, new Vector3(0f, 0.65f, 0f), new Vector3(0.08f, 0.55f, 0.08f), ParseHex("#6a4a2b"));
            mast.name = "Mast";
            var sail = CreatePrimitive(PrimitiveType.Cube, root, new Vector3(0.34f, 0.65f, 0f), new Vector3(0.58f, 0.42f, 0.04f), ParseHex("#d8efff"));
            sail.name = "Sail";
        }

        private void BuildRainPopup(Transform root, Color accent)
        {
            var cloud = CreatePrimitive(PrimitiveType.Sphere, root, new Vector3(0f, 0.45f, 0f), new Vector3(1.2f, 0.75f, 0.7f), accent);
            cloud.name = "Cloud";
            for (var i = -2; i <= 2; i++)
            {
                var drop = CreatePrimitive(PrimitiveType.Cylinder, root, new Vector3(i * 0.2f, 0.08f, 0f), new Vector3(0.05f, 0.17f, 0.05f), ParseHex("#7fd0ff"));
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
            var wave2 = CreatePrimitive(PrimitiveType.Cylinder, root, new Vector3(0.45f, 0.32f, 0f), new Vector3(0.27f, 0.18f, 1.1f), ParseHex("#78ccff"));
            wave2.transform.localRotation = Quaternion.Euler(0f, 0f, -22f);
        }

        private void BuildLightPopup(Transform root, Color accent)
        {
            var orb = CreatePrimitive(PrimitiveType.Sphere, root, new Vector3(0f, 0.42f, 0f), new Vector3(0.78f, 0.78f, 0.78f), accent);
            orb.name = "LightOrb";

            var glow = orb.AddComponent<Light>();
            glow.type = LightType.Point;
            glow.range = 5f;
            glow.intensity = 2f;
            glow.color = accent;
        }

        private static TextMesh CreateLabel(string name, Vector3 localPosition, float size, TextAnchor anchor)
        {
            var go = new GameObject(name);
            var text = go.AddComponent<TextMesh>();
            text.anchor = anchor;
            text.alignment = TextAlignment.Center;
            text.fontSize = 72;
            text.characterSize = size * 0.08f;
            text.color = ParseHex("#103a62");
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

        private void ApplyCoverColor(Color accent)
        {
            if (coverRenderer != null && coverRenderer.material != null)
            {
                coverRenderer.material.color = accent;
            }

            if (pageRenderer != null && pageRenderer.material != null)
            {
                pageRenderer.material.color = Color.white;
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
