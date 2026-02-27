import { UnityCommand, UnityEvent, UnityPagePayload } from "../types/domain";

const UNITY_COMMAND_EVENT_NAME = "arkanuh:unity:command";
const UNITY_EVENT_EVENT_NAME = "arkanuh:unity:event";

export type UnityLoaderConfig = {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl?: string;
  companyName?: string;
  productName?: string;
  productVersion?: string;
};

export type UnityInstance = {
  SendMessage?: (gameObjectName: string, methodName: string, value?: string | number) => void;
  Quit?: () => Promise<void>;
};

type UnityLoader = (
  canvas: HTMLCanvasElement,
  config: UnityLoaderConfig,
  onProgress?: (progress: number) => void
) => Promise<UnityInstance>;

declare global {
  interface Window {
    createUnityInstance?: UnityLoader;
  }
}

function safeJsonParse(value: unknown): UnityEvent | null {
  if (typeof value !== "string") {
    return null;
  }
  try {
    return JSON.parse(value) as UnityEvent;
  } catch {
    return null;
  }
}

export function getUnityLoader(): UnityLoader | null {
  if (typeof window === "undefined" || typeof window.createUnityInstance !== "function") {
    return null;
  }
  return window.createUnityInstance;
}

export function emitUnityCommand(command: UnityCommand) {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<UnityCommand>(UNITY_COMMAND_EVENT_NAME, {
      detail: command
    })
  );
}

export function emitUnityEvent(event: UnityEvent) {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<UnityEvent>(UNITY_EVENT_EVENT_NAME, {
      detail: event
    })
  );
}

export function subscribeUnityEvents(handler: (event: UnityEvent) => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const listener = (domEvent: Event) => {
    const custom = domEvent as CustomEvent<UnityEvent | string>;
    const detail = custom.detail;
    const parsed = typeof detail === "string" ? safeJsonParse(detail) : detail;
    if (!parsed) {
      return;
    }
    handler(parsed);
  };

  window.addEventListener(UNITY_EVENT_EVENT_NAME, listener as EventListener);
  return () => window.removeEventListener(UNITY_EVENT_EVENT_NAME, listener as EventListener);
}

export function sendUnityCommand(unityInstance: UnityInstance | null, command: UnityCommand) {
  emitUnityCommand(command);

  if (!unityInstance?.SendMessage) {
    return;
  }

  try {
    unityInstance.SendMessage("ReactBridge", "OnReactCommand", JSON.stringify(command));
  } catch {
    // Unity build belum tentu memiliki bridge object; event window tetap menjadi fallback.
  }
}

export function buildUnityPagePayload(page: UnityPagePayload): string {
  return JSON.stringify(page);
}

export function getUnityCommandEventName() {
  return UNITY_COMMAND_EVENT_NAME;
}

export function getUnityEventEventName() {
  return UNITY_EVENT_EVENT_NAME;
}
