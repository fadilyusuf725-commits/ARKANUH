using System.Runtime.InteropServices;
using UnityEngine;

namespace Arkanuh.UnityBridge
{
    public static class WebBridge
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void SendReactEvent(string json);
#endif

        public static void EmitEvent(string json)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            SendReactEvent(json);
#else
            Debug.Log($"[WebBridge] {json}");
#endif
        }
    }
}
