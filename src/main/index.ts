import { join } from "node:path";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { BrowserWindow, app, ipcMain, screen, shell } from "electron";
import icon from "../../resources/icon.png?asset";

export function centerWindow(win: BrowserWindow) {
  // ウィンドウのサイズを取得
  const [width, height] = win.getSize();

  // プライマリディスプレイの作業領域（タスクバーを除いた領域）を取得
  const { workArea } = screen.getPrimaryDisplay();

  // 中央の座標を計算
  const x = Math.round(workArea.x + (workArea.width - width) / 2);
  const y = Math.round(workArea.y + (workArea.height - height) / 2);

  // ウィンドウを移動
  win.setPosition(x, y);
}
export function positionWindowBottomRight(win: BrowserWindow) {
  // ウィンドウのサイズを取得
  const [width, height] = win.getSize();

  // プライマリディスプレイの作業領域（タスクバーを除いた領域）を取得
  const { workArea } = screen.getPrimaryDisplay();

  // 右下の座標を計算
  const x = workArea.x + workArea.width - width;
  const y = workArea.y + workArea.height - height;

  // ウィンドウを移動
  win.setPosition(x, y);
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  ipcMain.handle("resize-window", (_, { width, height, isBottomRight }) => {
    console.log("resize-window", width, height);
    mainWindow.setSize(width, height);

    if (isBottomRight) positionWindowBottomRight(mainWindow);
    else centerWindow(mainWindow);
  });

  ipcMain.handle("set-full-screen", (_, isFullScreen) => {
    mainWindow.setFullScreen(isFullScreen);
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
