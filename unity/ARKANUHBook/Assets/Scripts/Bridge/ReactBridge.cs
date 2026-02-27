using System;
using UnityEngine;

namespace Arkanuh.UnityBridge
{
    [Serializable]
    public class ReactCommandEnvelope
    {
        public string type = string.Empty;
        public string pageId = string.Empty;
        public string payload = string.Empty;
        public bool canAdvance;
    }

    public class ReactBridge : MonoBehaviour
    {
        [SerializeField] private FlipbookRuntimeController runtimeController;

        private void Awake()
        {
            if (runtimeController == null)
            {
                runtimeController = GetComponent<FlipbookRuntimeController>();
            }
        }

        public void OnReactCommand(string json)
        {
            if (string.IsNullOrWhiteSpace(json))
            {
                return;
            }

            ReactCommandEnvelope command;
            try
            {
                command = JsonUtility.FromJson<ReactCommandEnvelope>(json);
            }
            catch (Exception)
            {
                return;
            }

            if (command == null || runtimeController == null)
            {
                return;
            }

            switch (command.type)
            {
                case "LOAD_PAGE":
                    runtimeController.OnLoadPage(command.pageId, command.payload);
                    break;
                case "SET_CAN_ADVANCE":
                    runtimeController.SetCanAdvance(command.canAdvance);
                    break;
                case "RESET_VIEW":
                    runtimeController.ResetView();
                    break;
                case "PLAY_FINAL_CLOSE":
                    runtimeController.PlayFinalClose();
                    break;
            }
        }
    }
}
