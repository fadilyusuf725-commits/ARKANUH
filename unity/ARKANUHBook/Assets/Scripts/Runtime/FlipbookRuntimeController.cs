using System;
using System.Collections;
using UnityEngine;

namespace Arkanuh.UnityBridge
{
    [Serializable]
    public class UnityEventEnvelope
    {
        public string type = string.Empty;
    }

    public class FlipbookRuntimeController : MonoBehaviour
    {
        [SerializeField] private BookVisualBuilder visualBuilder;
        [SerializeField] private Camera mainCamera;
        [SerializeField] private float swipeThreshold = 64f;

        private bool canAdvance;
        private bool isFinalClosing;
        private bool introPlayed;
        private float pointerStartX;
        private bool pointerDown;
        private int currentPage = 1;

        private void Awake()
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            WebGLInput.captureAllKeyboardInput = false;
#endif
            EnsureSceneSetup();
        }

        private void Start()
        {
            if (!introPlayed)
            {
                StartCoroutine(PlayIntroSequence());
            }
        }

        private void Update()
        {
            if (isFinalClosing)
            {
                return;
            }

            if (visualBuilder != null)
            {
                visualBuilder.SetPopupSpin(Mathf.Repeat(Time.time * 18f, 360f));
            }

            HandleSwipeInput();
        }

        public void OnLoadPage(string pageId, string payloadJson)
        {
            EnsureSceneSetup();

            if (!string.IsNullOrWhiteSpace(pageId) && int.TryParse(pageId, out var parsedPage))
            {
                currentPage = parsedPage;
            }

            UnityPagePayloadData payload;
            try
            {
                payload = JsonUtility.FromJson<UnityPagePayloadData>(payloadJson);
            }
            catch (Exception)
            {
                payload = null;
            }

            if (payload == null)
            {
                payload = new UnityPagePayloadData
                {
                    id = pageId,
                    title = $"Halaman {currentPage}",
                    popupTemplate = "ark",
                    popupAccent = "#2f9bff",
                    floatingText = string.Empty
                };
            }

            visualBuilder.ApplyPageVisual(payload);

            StartCoroutine(PlayFlipAnimation());
        }

        public void SetCanAdvance(bool value)
        {
            canAdvance = value;
        }

        public void ResetView()
        {
            if (mainCamera == null)
            {
                return;
            }

            mainCamera.transform.position = new Vector3(0f, 1.8f, -6f);
            mainCamera.transform.rotation = Quaternion.Euler(10f, 0f, 0f);
        }

        public void PlayFinalClose()
        {
            if (isFinalClosing)
            {
                return;
            }
            StartCoroutine(PlayFinalCloseSequence());
        }

        private IEnumerator PlayIntroSequence()
        {
            introPlayed = true;

            var duration = 0.55f;
            var elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                var t = Mathf.Clamp01(elapsed / duration);
                var lift = Mathf.Lerp(0.45f, 0f, EaseOutCubic(t));
                var tilt = Mathf.Lerp(-3f, 0f, t);
                visualBuilder.ApplyBookTransform(lift, tilt);
                yield return null;
            }

            visualBuilder.ApplyBookTransform(0f, 0f);
        }

        private IEnumerator PlayFlipAnimation()
        {
            var duration = 0.36f;
            var elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                var t = Mathf.Clamp01(elapsed / duration);
                var arc = Mathf.Sin(t * Mathf.PI);
                visualBuilder.SetFlipProgress(arc);
                yield return null;
            }

            visualBuilder.SetFlipProgress(0f);
        }

        private IEnumerator PlayFinalCloseSequence()
        {
            isFinalClosing = true;

            var duration = 0.95f;
            var elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                var t = Mathf.Clamp01(elapsed / duration);
                var lift = Mathf.Lerp(0f, 0.15f, t);
                var tilt = Mathf.Lerp(0f, -8f, t);
                visualBuilder.ApplyBookTransform(lift, tilt);
                visualBuilder.SetFlipProgress(Mathf.Lerp(0f, 1f, t));
                yield return null;
            }

            EmitEvent("FINAL_CLOSE_DONE");
            isFinalClosing = false;
        }

        private void HandleSwipeInput()
        {
            if (Input.touchCount > 0)
            {
                var touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    pointerDown = true;
                    pointerStartX = touch.position.x;
                }
                else if (touch.phase == TouchPhase.Ended && pointerDown)
                {
                    HandleSwipeDelta(touch.position.x - pointerStartX);
                    pointerDown = false;
                }
            }
            else
            {
                if (Input.GetMouseButtonDown(0))
                {
                    pointerDown = true;
                    pointerStartX = Input.mousePosition.x;
                }

                if (Input.GetMouseButtonUp(0) && pointerDown)
                {
                    HandleSwipeDelta(Input.mousePosition.x - pointerStartX);
                    pointerDown = false;
                }
            }
        }

        private void HandleSwipeDelta(float deltaX)
        {
            if (Mathf.Abs(deltaX) < swipeThreshold)
            {
                return;
            }

            if (deltaX < 0f)
            {
                if (!canAdvance)
                {
                    return;
                }
                EmitEvent("REQUEST_NEXT_PAGE");
                return;
            }

            EmitEvent("REQUEST_PREV_PAGE");
        }

        private void EnsureSceneSetup()
        {
            if (mainCamera == null)
            {
                var existingCamera = Camera.main;
                if (existingCamera != null)
                {
                    mainCamera = existingCamera;
                }
                else
                {
                    var cameraGo = new GameObject("Main Camera");
                    mainCamera = cameraGo.AddComponent<Camera>();
                    mainCamera.clearFlags = CameraClearFlags.SolidColor;
                    mainCamera.backgroundColor = new Color(0.874f, 0.953f, 1f);
                    cameraGo.tag = "MainCamera";
                }
            }

            ResetView();

            if (FindFirstObjectByType<Light>() == null)
            {
                var lightGo = new GameObject("Directional Light");
                var light = lightGo.AddComponent<Light>();
                light.type = LightType.Directional;
                light.intensity = 1.1f;
                lightGo.transform.rotation = Quaternion.Euler(46f, -32f, 0f);
            }

            if (visualBuilder == null)
            {
                visualBuilder = GetComponent<BookVisualBuilder>();
                if (visualBuilder == null)
                {
                    visualBuilder = gameObject.AddComponent<BookVisualBuilder>();
                }
            }

            visualBuilder.InitializeVisualRig();
        }

        private void EmitEvent(string eventType)
        {
            var envelope = new UnityEventEnvelope
            {
                type = eventType
            };
            WebBridge.EmitEvent(JsonUtility.ToJson(envelope));
        }

        private static float EaseOutCubic(float value)
        {
            return 1f - Mathf.Pow(1f - value, 3f);
        }
    }
}
