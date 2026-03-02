using System.IO;
using Arkanuh.UnityBridge;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.SceneManagement;

namespace Arkanuh.UnityBridgeEditor
{
    public static class ProjectBootstrap
    {
        public const string SceneFolder = "Assets/Scenes";
        public const string ScenePath = "Assets/Scenes/FlipbookMain.unity";

        public static void EnsureProjectSetup()
        {
            EnsureFolders();
            EnsureBuiltInRenderPipeline();
            EnsureScene();
            EnsureBuildSettings();
            EnsurePlayerSettings();
        }

        private static void EnsureFolders()
        {
            if (!AssetDatabase.IsValidFolder(SceneFolder))
            {
                AssetDatabase.CreateFolder("Assets", "Scenes");
            }
        }

        private static void EnsureBuiltInRenderPipeline()
        {
            GraphicsSettings.defaultRenderPipeline = null;
            QualitySettings.renderPipeline = null;
        }

        private static void EnsureScene()
        {
            if (File.Exists(ScenePath))
            {
                return;
            }

            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

            var cameraGo = new GameObject("Main Camera");
            cameraGo.tag = "MainCamera";
            var camera = cameraGo.AddComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.874f, 0.953f, 1f);
            cameraGo.transform.position = new Vector3(0f, 2.8f, -9f);
            cameraGo.transform.rotation = Quaternion.Euler(14f, 0f, 0f);

            var lightGo = new GameObject("Directional Light");
            var light = lightGo.AddComponent<Light>();
            light.type = LightType.Directional;
            light.intensity = 1.2f;
            lightGo.transform.rotation = Quaternion.Euler(46f, -32f, 0f);

            var bridgeGo = new GameObject("ReactBridge");
            bridgeGo.AddComponent<BookVisualBuilder>();
            bridgeGo.AddComponent<FlipbookRuntimeController>();
            bridgeGo.AddComponent<ReactBridge>();

            EditorSceneManager.SaveScene(scene, ScenePath);
            AssetDatabase.Refresh();
        }

        private static void EnsureBuildSettings()
        {
            var scene = new EditorBuildSettingsScene(ScenePath, true);
            EditorBuildSettings.scenes = new[] { scene };
        }

        private static void EnsurePlayerSettings()
        {
            PlayerSettings.companyName = "ARKANUH";
            PlayerSettings.productName = "ARKANUHBook";
            PlayerSettings.bundleVersion = "4.0.0";
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Brotli;
            PlayerSettings.WebGL.decompressionFallback = true;
            PlayerSettings.WebGL.nameFilesAsHashes = false;
            PlayerSettings.SetScriptingBackend(BuildTargetGroup.WebGL, ScriptingImplementation.IL2CPP);
        }
    }
}
