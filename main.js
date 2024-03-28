import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { exec } from 'child_process';

function showInfoMessage(message) {
  dialog.showMessageBox({
    type: 'info',
    message: message,
    buttons: ['OK'],
  });
}

function showErrorMessage(title, message, error) {
  dialog.showErrorBox(title, `${message}\n\n${error}`);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'src/assets/favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadURL('http://localhost/');
}

app
  .whenReady()
  .then(async () => {
    try {
      const sketchup_folder = '%USERPROFILE%\\AppData\\Roaming\\SketchUp';
      await new Promise((resolve, reject) => {
        exec('net session >nul 2>&1', error => {
          if (error) reject('Voce precisa executar o programa com privilegio de administrador!');
          resolve();
        });
      });
      await new Promise((resolve, reject) => {
        exec(`dir ${sketchup_folder}`, async error => {
          if (error) reject('Intalacao do Sketchup nao encontrada');
          resolve();
        });
      });
      showInfoMessage('Iniciando o VRX, na primeira execucao o processo pode levar alguns minutos!');
      await new Promise((resolve, reject) => {
        console.log('Intalando Chocolatey e Apache...');
        exec('.\\src\\scripts\\apache.bat', (error, stdout) => {
          if (error) reject(error);
          if (stdout) console.log(stdout);
          resolve();
        });
      });
      await new Promise((resolve, reject) => {
        console.log('Intalando Ruby e Setando Materiais...');
        exec('.\\src\\scripts\\ruby.bat', (error, stdout) => {
          if (error) reject(error);
          if (stdout) console.log(stdout);
          resolve();
        });
      });
      console.log('Iniciando Ruby API...');
      exec('.\\src\\scripts\\api.bat', (error, stdout) => {
        if (error) console.log(error);
        if (stdout) console.log(stdout);
      });
      await new Promise(r => setTimeout(r, 3000));
      createWindow();
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
      });
    } catch (e) {
      showErrorMessage('Erro', 'Erro na Instalacao', e);
    }
  })
  .catch(e => {
    showErrorMessage('Erro', 'Erro na Instalacao', e);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
