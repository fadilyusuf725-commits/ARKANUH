using System;

namespace Arkanuh.UnityBridge
{
    [Serializable]
    public class UnityPagePayloadData
    {
        public string id = "1";
        public string title = "Halaman";
        public string popupTemplate = "ark";
        public string popupAccent = "#2f9bff";
        public string floatingText = string.Empty;
        public string modelKey = string.Empty;
        public string pageTexture = string.Empty;
        public string coverTitle = "ARKANUH";
        public string[] backCoverSummary;
    }
}
