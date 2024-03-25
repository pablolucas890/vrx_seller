import {app,BrowserWindow, dialog  } from 'electron';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { exec } from 'child_process';

async function showInfoMessage(message) {
  dialog.showMessageBox({
    type: 'info',
    message: message,
    buttons: ['OK']
  });
  await new Promise(r => setInterval(r, 3000));
}

function showErrorMessage(title, message, error) {
  dialog.showErrorBox(title, `${message}\n\n${error}`);
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'src/assets/favicon.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadURL('http://localhost/');
}

app.whenReady().then(async ()=> {
  try {
    // TODO: Verificar se o skectchup esta instalado antes de prosseguir
    const scriptPath = process.platform == 'win32' ? 'win.bat' : 'linux.sh';
    const apache_conf_folder = process.platform == 'win32' ?
      '%USERPROFILE%\\AppData\\Roaming\\Apache24\\conf'
      : '/etc/apache2/sites-available/';

    await new Promise((resolve, reject) => {
      exec(`dir ${apache_conf_folder}`, async (error, stdout, stderr) => {
        if (stderr) console.warn(`stderr: ${stderr}`);
        if (error){
          await showInfoMessage('Iniciando instalação do Apache, este processo pode levar alguns minutos!');
          exec(`.\\src\\scripts\\preinstall-${scriptPath}`, (error, stdout, stderr) => {
            if (stderr) console.warn(`stderr: ${stderr}`);
            if (error) reject(error);
            resolve();
          });
        } else resolve();
      });
    });
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  }catch(e){
    showErrorMessage('Erro', e);
  }
}).catch((e) => {
  showErrorMessage('Erro', e);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});