import { app, BrowserWindow, dialog } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { exec } from 'child_process';

// util functions
function getHtml(message, percent, log) {
  const random = Math.random() * 5;
  percent = (percent - random).toFixed(2);

  return `
    data:text/html;charset=utf-8,${encodeURI(`
    <html>
      <head>
        <meta charset="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
      </head>
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .loader {
          border: 16px solid rgb(14, 25, 83);
          border-top: 16px solid rgb(134, 138, 165);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <body>
        <h1>${message}</h1>
        <h2 style="color: red">Aguarde e não feche essa janela até a conclusão</h2>
        <div style="width: 80%; height: 20px; background-color: rgb(134, 138, 165); border-radius: 10px; margin: 20px 10px;">
          <div style="width: ${percent}%; height: 100%; background-color: rgb(14, 25, 83); border-radius: 10px;"></div>
        </div>
        <p>${percent}% Completo</p>
        <div class="loader"></div>
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
    buttons: ['Instalar pacotes restantes', 'Restaurar Instalação', 'Sair'],
    defaultId: 2,
    title: 'Instalação',
    message: 'Alguns pacotes necessários para a execução do programa não foram encontrados. O que deseja fazer?',
    cancelId: 2, // Define a ação para o botão Cancelar
  };

  const { response } = await dialog.showMessageBox(options);
  return response;
}

async function showErrorMessage(title, message, error) {
  const options = {
    type: 'error',
    buttons: ['OK', 'Reportar'],
    defaultId: 0,
    title: title,
    message: `${message}\n\n${error}`,
    cancelId: 0,
  };

  let response = await dialog.showMessageBox(options);
  return response.response;
}

async function reportError(error) {
  const url = 'mailto:vrxexperiencia@gmail.com';
  exec(`start ${url}?subject=Tive um erro na instalação do programa&body=${error}`);
  await new Promise(r => setTimeout(r, 500));
}

async function startAPI(progressWindow, log) {
  exec('.\\src\\scripts\\api.bat', (error, stdout) => {
    if (error) console.log(error);
    if (stdout) console.log(stdout);
  });
  progressWindow.loadURL(getHtml('Inicializando a API...', 33, log));
  await new Promise(r => setTimeout(r, 2000));
  progressWindow.loadURL(getHtml('API inicializada', 66, log));
  await new Promise(r => setTimeout(r, 2000));
  progressWindow.loadURL(getHtml('Abrindo a aplicação...', 100, log));
  await new Promise(r => setTimeout(r, 2000));
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
          if (error) reject('Você precisa executar o programa com privilégio de administrador!');
          resolve();
        });
      });

      // Check all dependencies to run the app
      await new Promise(resolve => {
        progressWindow.loadURL(getHtml('Verificando as instalações...', 30, log));
        exec('.\\src\\scripts\\check.bat', (error, stdout) => {
          console.log(stdout);
          if (stdout || error) needInstall = true;
          log = 'Instalações verificadas com sucesso';
          resolve();
        });
      });

      if (needInstall) {
        const action = await showInstallOrRepairDialog();

        if (action === 1) {
          // Repair
          const options = {
            type: 'question',
            buttons: ['Sim, quero restaurar toda instalação', 'Apenas instalar os pacotes restantes', 'Cancelar'],
            defaultId: 2,
            title: 'Reparar instalação?',
            message:
              'Deseja reparar a instalação do programa? Todas as texturas locais serão apagadas e o programa será reinstalado.',
            cancelId: 2,
          };
          const { response } = await dialog.showMessageBox(options);
          if (response === 2) {
            progressWindow.close();
            return;
          } else if (response === 0) {
            await new Promise((resolve, reject) => {
              progressWindow.loadURL(getHtml('Reparando a instalação...', 60));
              exec('.\\src\\scripts\\clean.bat', (error, stdout) => {
                if (error) reject(error);
                console.log(stdout);
                log = 'Reparação concluída com sucesso';
                resolve();
              });
            });
          }
        }
        if (action === 0 || action === 1) {
          // Install
          await new Promise((resolve, reject) => {
            progressWindow.loadURL(getHtml('Verificando a instalação do Sketchup...', 10, log));
            exec(`dir ${sketchup_folder}`, async error => {
              if (error) reject('Intalacao do Sketchup não encontrada, verifique se o Sketchup está instalado e sua conta está logada');
              log = 'Instalação do Sketchup encontrada com sucesso';
              resolve();
            });
          });
          await new Promise((resolve, reject) => {
            progressWindow.loadURL(getHtml('Configurando o Chocolatey e o Apache...', 40, log));
            exec('.\\src\\scripts\\apache.bat', (error, stdout) => {
              if (error) reject(error + '\n' + stdout);
              log = 'Chocolatey e Apache configurados com sucesso';
              console.log(stdout);
              resolve();
            });
          });
          await new Promise((resolve, reject) => {
            progressWindow.loadURL(getHtml('Instalando o Ruby e configurando materiais...', 60, log));
            exec('.\\src\\scripts\\ruby.bat', (error, stdout) => {
              if (error) reject(error + '\n' + stdout);
              log = 'Ruby instalado e materiais setados com sucesso';
              console.log(stdout);
              resolve();
            });
          });
          await new Promise((resolve, reject) => {
            progressWindow.loadURL(getHtml('Baixando arquivos de ambiente...', 80, log));
            exec('.\\src\\scripts\\environments.bat', (error, stdout) => {
              if (error) reject(error + '\n' + stdout);
              log = 'Arquivos de ambiente baixados com sucesso';
              console.log(stdout);
              resolve();
            });
          });
          startAPI(progressWindow, log);
        } else if (action === 2) {
          progressWindow.close();
        }
      } else startAPI(progressWindow);
    } catch (e) {
      await new Promise(r => setTimeout(r, 300));
      const action = await showErrorMessage('Erro', 'Erro na Instalação', e);
      if (action === 1) await reportError(e);
      progressWindow.close();
    }
  })
  .catch(async e => {
    const action = await showErrorMessage('Erro', 'Erro na Instalação', e);
    if (action === 1) await reportError(e);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
