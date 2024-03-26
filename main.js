// TODO: Ao desisntalar o electron, executar o clean.bat
import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { exec } from 'child_process';

async function showInfoMessage(message) {
  dialog.showMessageBox({
    type: 'info',
    message: message,
    buttons: ['OK'],
  });
  await new Promise(r => setInterval(r, 3000));
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
      const apache_conf_folder = '%USERPROFILE%\\AppData\\Roaming\\Apache24\\conf';
      const sketchup_folder = '%USERPROFILE%\\AppData\\Roaming\\SketchUp';

      // TODO: Verificar se esta rodando como administrador
      await new Promise((resolve, reject) => {
        exec(`dir ${sketchup_folder}`, async error => {
          if (error) reject('Intalacao do Sketchup nao encontrada');
          console.log('Instalacao do Sketchup encontrada com sucesso');
          exec(`dir ${apache_conf_folder}`, async error => {
            if (error) {
              showInfoMessage('Iniciando instalacoes, este processo pode levar alguns minutos!');
              console.log('Instalando Chocolatey e Apache...');
              exec('.\\src\\scripts\\apache.bat', (error, stdout) => {
                if (error) reject(error);
                console.log('------------------stdout----------------------');
                if (stdout) console.log(stdout);
                console.log('------------------stdout----------------------');
                console.log('Intalando Ruby e Setando Materiais...');
                exec('.\\src\\scripts\\ruby.bat', (error, stdout) => {
                  if (error) reject(error);
                  console.log('------------------stdout----------------------');
                  if (stdout) console.log(stdout);
                  console.log('------------------stdout----------------------');
                  // TODO: Fazer Download do projeto do plugin no github e enviar para a pasta Plugins
                  // TODO: Fazer Download dos enviroments e enviar para a pasta do sketchup
                  resolve();
                });
              });
            } else resolve();
          });
        });
      });
      console.log('Iniciando Ruby API...');
      // TODO: Fechar api antiga para nao ter conflito de cors e testar
      exec('start /B ruby .\\src\\api.rb');
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
