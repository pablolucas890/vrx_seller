import { app, BrowserWindow, dialog } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { exec } from 'child_process';

// util functions
function getHtml(message, percent, log) {
  return `
    data:text/html;charset=utf-8,${encodeURI(`
    <html>
      <head>
        <meta charset="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
      </head>
      <body style="font-family: 'Poppins', sans-serif; display: flex; justify-content: center; align-items: center; flex-direction: column;">
        <h1>${message}</h1>
        <h2>Aguarde e não feche essa janela até a conclusão.</h2>
        <div style="width: 80%; height: 20px; background-color: gray; border-radius: 10px; margin: 20px 10px;">
          <div style="width: ${percent}%; height: 100%; background-color: blue; border-radius: 10px;"></div>
        </div>
        <p>${percent}% Completo</p>
        <br>
        <br>
        <h3>Últimos Logs</h3>
        <pre>${log || ''}</pre>
      </body>
    </html>
    `)}
  `;
}

async function showInstallOrRepairDialog() {
  const options = {
    type: 'question',
    buttons: ['Instalar', 'Reparar', 'Cancelar'],
    defaultId: 2,
    title: 'Instalação',
    message: 'Deseja instalar os pacotes necessários ou reparar a instalação?',
    cancelId: 2, // Define a ação para o botão Cancelar
  };

  let response = await dialog.showMessageBox(options);
  return response.response;
}

function showErrorMessage(title, message, error) {
  dialog.showErrorBox(title, `${message}\n\n${error}`);
}

async function startAPI(progressWindow, log) {
  exec('.\\src\\scripts\\api.bat', (error, stdout) => {
    if (error) console.log(error);
    if (stdout) console.log(stdout);
  });
  progressWindow.loadURL(getHtml('Inicializando a API...', 33, log));
  await new Promise(r => setTimeout(r, 1000));
  progressWindow.loadURL(getHtml('API inicializada', 66, log));
  await new Promise(r => setTimeout(r, 1000));
  progressWindow.loadURL(getHtml('Abrindo a aplicação...', 100, log));
  await new Promise(r => setTimeout(r, 1000));
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
  progressWindow.close();
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'assets/favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL('http://localhost/');
  mainWindow.on('close', async () => {
    console.log('Closing Sketchup');
    try {
      await fetch('http://localhost:4567/close_sketchup');
    } catch (err) {
      console.error('Error calling API on close:', err);
    }
    await new Promise(r => setTimeout(r, 1000));
    app.quit();
  });
}

app
  .whenReady()
  .then(async () => {
    let log = '';
    let needInstall = false;
    let progressWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    const sketchup_folder = '%USERPROFILE%\\AppData\\Roaming\\SketchUp';

    try {
      // Check administator privileges
      await new Promise((resolve, reject) => {
        exec('net session >nul 2>&1', error => {
          if (error) reject('Voce precisa executar o programa com privilegio de administrador!');
          resolve();
        });
      });

      // Check all dependencies to run the app
      await new Promise(resolve => {
        exec('.\\src\\scripts\\check.bat', (error, stdout) => {
          console.log(stdout);
          if (stdout) needInstall = true;
          resolve();
        });
      });

      if (needInstall) {
        const action = await showInstallOrRepairDialog();

        if (action === 0) {
          // Install
          await new Promise((resolve, reject) => {
            progressWindow.loadURL(getHtml('Verificando a instalação do Sketchup...', 20, log));
            exec(`dir ${sketchup_folder}`, async error => {
              if (error) reject('Intalacao do Sketchup não encontrada');
              log = 'Instalação do Sketchup encontrada';
              resolve();
            });
          });
          await new Promise((resolve, reject) => {
            progressWindow.loadURL(getHtml('Configurando o Chocolatey e o Apache...', 40, log));
            exec('.\\src\\scripts\\apache.bat', (error, stdout) => {
              if (error) reject(error);
              log = stdout;
              console.log(stdout);
              resolve();
            });
          });
          await new Promise((resolve, reject) => {
            progressWindow.loadURL(getHtml('Instalando o Ruby e setando materiais...', 60, log));
            exec('.\\src\\scripts\\ruby.bat', (error, stdout) => {
              if (error) reject(error);
              log = stdout;
              console.log(stdout);
              resolve();
            });
          });
          startAPI(progressWindow, log);
        } else if (action === 1) {
          // Repair
          await new Promise((resolve, reject) => {
            progressWindow.loadURL(getHtml('Reparando a instalação', 0));
            exec('.\\src\\scripts\\clean.bat', (error, stdout) => {
              if (error) reject(error);
              console.log(stdout);
              log = stdout;
              resolve();
            });
          });
          progressWindow.loadURL(getHtml('Reparaçao concluida', 100, log));
          await new Promise(r => setTimeout(r, 500));
          app.relaunch();
          progressWindow.close();
        }
      } else startAPI(progressWindow);
    } catch (e) {
      await new Promise(r => setTimeout(r, 300));
      showErrorMessage('Erro', 'Erro na Instalação', e);
      progressWindow.close();
    }
  })
  .catch(e => {
    showErrorMessage('Erro', 'Erro na Instalação', e);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});