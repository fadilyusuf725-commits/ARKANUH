using System;
using System.Collections.Generic;
using UnityEngine;

namespace Arkanuh.UnityBridge
{
    [Serializable]
    public class PageModelRegistryEntry
    {
        public string pageId = "1";
        public string modelKey = "page-01";
        public GameObject prefab;
        public float scale = 1f;
        public float yaw;
        public float yOffset;
    }

    [CreateAssetMenu(fileName = "PageModelRegistry", menuName = "ARKANUH/Page Model Registry")]
    public class PageModelRegistry : ScriptableObject
    {
        [SerializeField] private List<PageModelRegistryEntry> entries = new List<PageModelRegistryEntry>();

        private readonly Dictionary<string, PageModelRegistryEntry> byPageId = new Dictionary<string, PageModelRegistryEntry>();
        private readonly Dictionary<string, PageModelRegistryEntry> byModelKey = new Dictionary<string, PageModelRegistryEntry>();
        private bool isLookupReady;

        public IReadOnlyList<PageModelRegistryEntry> Entries => entries;

        private void OnEnable()
        {
            RebuildLookup();
        }

        public void ReplaceEntries(List<PageModelRegistryEntry> nextEntries)
        {
            entries = nextEntries ?? new List<PageModelRegistryEntry>();
            RebuildLookup();
        }

        public bool TryGet(string pageId, string modelKey, out PageModelRegistryEntry entry)
        {
            EnsureLookup();

            if (!string.IsNullOrWhiteSpace(modelKey) && byModelKey.TryGetValue(modelKey, out entry))
            {
                return true;
            }

            if (!string.IsNullOrWhiteSpace(pageId) && byPageId.TryGetValue(pageId, out entry))
            {
                return true;
            }

            entry = null;
            return false;
        }

        private void EnsureLookup()
        {
            if (!isLookupReady)
            {
                RebuildLookup();
            }
        }

        private void RebuildLookup()
        {
            byPageId.Clear();
            byModelKey.Clear();

            foreach (var entry in entries)
            {
                if (entry == null)
                {
                    continue;
                }

                if (!string.IsNullOrWhiteSpace(entry.pageId) && !byPageId.ContainsKey(entry.pageId))
                {
                    byPageId.Add(entry.pageId, entry);
                }

                if (!string.IsNullOrWhiteSpace(entry.modelKey) && !byModelKey.ContainsKey(entry.modelKey))
                {
                    byModelKey.Add(entry.modelKey, entry);
                }
            }

            isLookupReady = true;
        }
    }
}
