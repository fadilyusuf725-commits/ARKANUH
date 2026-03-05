using System;
using System.Collections.Generic;
using System.IO;
using Arkanuh.UnityBridge;
using UnityEditor;
using UnityEngine;

namespace Arkanuh.UnityBridgeEditor
{
    [Serializable]
    internal class PageModelLinkEntry
    {
        public string pageId;
        public string sourceType = "direct_file";
        public string url;
        public string format;
        public float scale = 1f;
        public float yaw;
        public float yOffset;
    }

    [Serializable]
    internal class PageModelLinkManifest
    {
        public PageModelLinkEntry[] items;
    }

    public static class ModelImportPipeline
    {
        private const string MappingRelativePath = "assets/model-links/page-model-links.json";
        private const string IncomingDirectory = "Assets/Models/Incoming";
        private const string PrefabDirectory = "Assets/Prefabs/PageModels";
        private const string RegistryAssetPath = "Assets/Resources/PageModelRegistry.asset";

        [MenuItem("ARKANUH/Models/Rebuild Page Model Registry")]
        public static void RebuildPageModelRegistry()
        {
            try
            {
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
                EnsureFolderExists("Assets/Prefabs");
                EnsureFolderExists(PrefabDirectory);
                EnsureFolderExists("Assets/Resources");

                var manifest = LoadManifest();
                ValidateManifest(manifest);
                var registry = LoadOrCreateRegistry();
                var registryEntries = new List<PageModelRegistryEntry>();

                foreach (var item in manifest.items)
                {
                    var pageNumber = ParsePageNumber(item.pageId);
                    if (string.Equals(item.sourceType, "none", StringComparison.OrdinalIgnoreCase))
                    {
                        continue;
                    }

                    var pageToken = $"page-{pageNumber:D2}";
                    var format = ResolveFormat(item);
                    var modelAssetPath = $"{IncomingDirectory}/{pageToken}.{format}";
                    var modelRoot = LoadModelRoot(modelAssetPath);

                    if (modelRoot == null)
                    {
                        Debug.LogWarning(
                            $"Model halaman tidak ditemukan atau belum terimport: {modelAssetPath}. Entry page {item.pageId} dilewati."
                        );
                        continue;
                    }

                    var tempInstance = PrefabUtility.InstantiatePrefab(modelRoot) as GameObject;
                    if (tempInstance == null)
                    {
                        tempInstance = UnityEngine.Object.Instantiate(modelRoot);
                    }

                    tempInstance.name = pageToken;
                    tempInstance.transform.SetPositionAndRotation(Vector3.zero, Quaternion.identity);
                    tempInstance.transform.localScale = Vector3.one;
                    RemoveColliders(tempInstance);

                    var prefabPath = $"{PrefabDirectory}/{pageToken}.prefab";
                    var pagePrefab = PrefabUtility.SaveAsPrefabAsset(tempInstance, prefabPath);
                    UnityEngine.Object.DestroyImmediate(tempInstance);

                    registryEntries.Add(
                        new PageModelRegistryEntry
                        {
                            pageId = pageNumber.ToString(),
                            modelKey = pageToken,
                            prefab = pagePrefab,
                            scale = item.scale <= 0f ? 1f : item.scale,
                            yaw = item.yaw,
                            yOffset = item.yOffset
                        }
                    );
                }

                registry.ReplaceEntries(registryEntries);
                EditorUtility.SetDirty(registry);
                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
                Debug.Log($"Model registry selesai dibuat: {registryEntries.Count} prefab aktif.");
            }
            catch (Exception exception)
            {
                Debug.LogError($"Model import pipeline gagal: {exception.Message}");
                throw;
            }
        }

        private static PageModelLinkManifest LoadManifest()
        {
            var repoRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var mappingPath = Path.Combine(repoRoot, MappingRelativePath.Replace("/", Path.DirectorySeparatorChar.ToString()));

            if (!File.Exists(mappingPath))
            {
                throw new FileNotFoundException($"Mapping model tidak ditemukan: {mappingPath}");
            }

            var json = File.ReadAllText(mappingPath);
            var wrappedJson = "{\"items\":" + json + "}";
            var manifest = JsonUtility.FromJson<PageModelLinkManifest>(wrappedJson);
            if (manifest == null || manifest.items == null || manifest.items.Length == 0)
            {
                throw new InvalidDataException("Isi page-model-links.json kosong atau tidak valid.");
            }

            return manifest;
        }

        private static void ValidateManifest(PageModelLinkManifest manifest)
        {
            var seen = new HashSet<int>();
            foreach (var item in manifest.items)
            {
                var pageNumber = ParsePageNumber(item.pageId);
                if (!seen.Add(pageNumber))
                {
                    throw new InvalidDataException($"Duplikat pageId terdeteksi: {item.pageId}");
                }

                if (string.IsNullOrWhiteSpace(item.sourceType))
                {
                    throw new InvalidDataException($"sourceType kosong pada pageId {item.pageId}.");
                }

                if (!string.Equals(item.sourceType, "tripo_page", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(item.sourceType, "direct_file", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(item.sourceType, "none", StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidDataException($"sourceType tidak valid pada pageId {item.pageId}: {item.sourceType}");
                }
            }

            for (var page = 1; page <= 10; page += 1)
            {
                if (!seen.Contains(page))
                {
                    throw new InvalidDataException($"Mapping untuk pageId {page} belum ada.");
                }
            }
        }

        private static int ParsePageNumber(string pageId)
        {
            if (!int.TryParse(pageId, out var parsed) || parsed < 1 || parsed > 10)
            {
                throw new InvalidDataException($"pageId tidak valid: {pageId}");
            }

            return parsed;
        }

        private static string ResolveFormat(PageModelLinkEntry item)
        {
            if (string.Equals(item.sourceType, "none", StringComparison.OrdinalIgnoreCase))
            {
                return string.Empty;
            }

            var format = item.format?.Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(format))
            {
                if (!string.IsNullOrWhiteSpace(item.url))
                {
                    if (item.url.IndexOf(".fbx", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        return "fbx";
                    }
                    if (item.url.IndexOf(".glb", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        return "glb";
                    }
                }

                throw new InvalidDataException($"Format model tidak valid untuk pageId {item.pageId}.");
            }

            if (!string.Equals(format, "fbx", StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(format, "glb", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidDataException($"Format model harus fbx/glb pada pageId {item.pageId}.");
            }

            return format;
        }

        private static void RemoveColliders(GameObject target)
        {
            var colliders = target.GetComponentsInChildren<Collider>(true);
            foreach (var collider in colliders)
            {
                if (collider != null)
                {
                    UnityEngine.Object.DestroyImmediate(collider);
                }
            }
        }

        private static PageModelRegistry LoadOrCreateRegistry()
        {
            var registry = AssetDatabase.LoadAssetAtPath<PageModelRegistry>(RegistryAssetPath);
            if (registry != null)
            {
                return registry;
            }

            registry = ScriptableObject.CreateInstance<PageModelRegistry>();
            AssetDatabase.CreateAsset(registry, RegistryAssetPath);
            AssetDatabase.SaveAssets();
            return registry;
        }

        private static void EnsureFolderExists(string assetPath)
        {
            if (AssetDatabase.IsValidFolder(assetPath))
            {
                return;
            }

            var parent = Path.GetDirectoryName(assetPath)?.Replace("\\", "/");
            if (string.IsNullOrWhiteSpace(parent))
            {
                return;
            }

            EnsureFolderExists(parent);
            var folderName = Path.GetFileName(assetPath);
            AssetDatabase.CreateFolder(parent, folderName);
        }

        private static GameObject LoadModelRoot(string modelAssetPath)
        {
            var direct = AssetDatabase.LoadAssetAtPath<GameObject>(modelAssetPath);
            if (direct != null)
            {
                return direct;
            }

            var main = AssetDatabase.LoadMainAssetAtPath(modelAssetPath) as GameObject;
            if (main != null)
            {
                return main;
            }

            var allAssets = AssetDatabase.LoadAllAssetsAtPath(modelAssetPath);
            foreach (var asset in allAssets)
            {
                if (asset is GameObject gameObject)
                {
                    return gameObject;
                }
            }

            return null;
        }
    }
}
