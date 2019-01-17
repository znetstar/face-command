import { app, BrowserWindow, session, protocol, Menu, shell, ipcMain } from "electron";
import { Main, ConfigureNconf } from "face-command-server/lib/launch";
import defaultConfig from "face-command-server/lib/DefaultConfiguration";
import { ElectronTransport } from "multi-rpc-electron-transport";
import { MsgPackSerializer } from "multi-rpc-msgpack-serializer";
import { Provider } from "nconf";
import * as _ from "lodash";
const { localStorage } = require('electron-browser-storage');
import * as path from "path";

const channelName = "face-command";
const rootWebDir = path.join(__dirname, "..", "node_modules", "face-command-web", "dist", "face-command-web");
let window;

protocol.registerStandardSchemes(["file"], { secure: true });

async function gui() {
    window = new BrowserWindow({ 
        height: 768, 
        width: 1024, 
        icon: path.join(__dirname, "..", "icons", "app-icon.png"), 
        autoHideMenuBar: false ,
        webPreferences: {
            nodeIntegration: true
        },
        title: "Face Command"
    });

    let menu = [
        {
          label: 'Edit',
          submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'selectall'}
          ]
        },
        {
          role: 'window',
          submenu: [
            {role: 'minimize'},
            {role: 'close'}
          ]
        },
        {
          role: 'help',
          submenu: [
            {
              label: 'Learn More',
              click: () => { shell.openExternal('https://github.com/znetstar/aria2ui') }
            }
          ]
        }
      ]
      if (process.platform === 'darwin') {
        menu.unshift({
            label: app.getName(),
            submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
            ]
        })
        
        menu[2].submenu = [
            {role: 'close'},
            {role: 'minimize'},
            {role: 'zoom'},
            {type: 'separator'},
            {role: 'front'}
        ]
    };

    await localStorage.setItem("baseHref", "./");
    await localStorage.setItem("useHash", 1);
    // await localStorage.setItem("logErrors", 1);
    // await localStorage.setItem("devMode", 1);
    await localStorage.setItem("electronChannel", channelName);

    Menu.setApplicationMenu(Menu.buildFromTemplate(<any>menu));

    window.loadFile(path.join(rootWebDir, "index.html"));
    window.on('page-title-updated', (e) => { e.preventDefault(); })

    // window.webContents.openDevTools();

    window.on("closed", () => { app.quit(); });
}

const transport = new ElectronTransport(new MsgPackSerializer(), channelName, { ipcMain });

const defaults = _.cloneDeep(defaultConfig);
defaults.httpServer = false;
defaults.rpcTransports = [ transport ];

const nconf = new Provider();
ConfigureNconf(nconf, defaults);

app.once("ready", async () => {
  await Main(nconf);
  await gui();
});