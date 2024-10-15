import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
  resizeWindow: async (width: number, height: number, isBottomRight = true) => {
    await ipcRenderer.invoke("set-full-screen", false);
    await ipcRenderer.invoke("resize-window", { width, height, isBottomRight });
  },
  setFullScreen: async (isFullScreen: boolean) => {
    await ipcRenderer.invoke("set-full-screen", isFullScreen);
  },
  uploadVideo: async () => {
    return await ipcRenderer.invoke("upload-video");
  },
  setAlwaysOnTop: async (isAlwaysOnTop: boolean) => {
    await ipcRenderer.invoke("set-always-on-top", isAlwaysOnTop);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
