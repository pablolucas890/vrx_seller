@echo off

REM Consts Definitions
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
cd ..
cd ..
set OLD_DIR=%CD%
set APACHE_BIN_FILE=%USERPROFILE%\AppData\Roaming\Apache24\bin\httpd.exe
set APACHE_CONF_FOLDER=%USERPROFILE%\AppData\Roaming\Apache24\conf
set HTTPD_CONF_FILE=%APACHE_CONF_FOLDER%\httpd.conf

REM Install Chocolatey
where choco >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Instalando o Chocolatey
    cmd /c @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
    IF %ERRORLEVEL% NEQ 0 (
        echo - Falha ao instalar o Chocolatey. Por favor, instale manualmente e tente novamente.
        exit 1
    )
    echo - O Chocolatey foi instalado com sucesso.
) ELSE (
    echo - Chocolatey ja esta instalado
)

REM TODO: Instalar ruby
REM TODO: Iniciar API em ruby
REM TODO: Enviar Materials em png pra pasta de Materials do sketchup
REM TODO: Fazer Download do projeto do plugin no github e enviar para a pasta Plugins
REM TODO: Fazer Download dos enviroments e enviar para a pasta do sketchup
REM TODO: Dividir as execucos em partes de forma a retornar pro usuario o processo em um HTML
REM TODO: Criar um script de clean para limpar instalacoes mal sucedidas

REM Install Apache
dir %APACHE_CONF_FOLDER% >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Instalando o Apache HTTPD
    choco install -y apache-httpd --params '/Port:80'
    echo - Startando Apache HTTPD
    %APACHE_BIN_FILE% -k install
) ELSE (
    echo - Apache HTTPD ja esta instalado
)
%APACHE_BIN_FILE% -v >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Erro na Instalacao do Apache
    exit 1
)

REM Copia os arquivos da build para o diretorio do Apache
echo - Copiando os arquivos da build para o diretorio do Apache
xcopy /s /y "%OLD_DIR%\build\" "%USERPROFILE%\AppData\Roaming\Apache24\htdocs\" >NUL 2>&1

REM Configura o config do Apache
findstr /c:"# VRX Configs" %HTTPD_CONF_FILE% > nul || (
    echo - Reescrevendo configuracoes do httpd
    echo # VRX Configs >> %HTTPD_CONF_FILE%
    echo LoadModule rewrite_module modules/mod_rewrite.so >> "%HTTPD_CONF_FILE%"
    echo ^<Directory "${SRVROOT}/htdocs"^> >> "%HTTPD_CONF_FILE%"
    echo Options Indexes FollowSymLinks >> "%HTTPD_CONF_FILE%"
    echo AllowOverride All >> "%HTTPD_CONF_FILE%"
    echo Require all granted >> "%HTTPD_CONF_FILE%"
    echo ^</Directory^> >> "%HTTPD_CONF_FILE%"
)
echo - Restartando Apache
echo -     Matando Processos na porta 80
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":]:80"') do (
    set "PID=%%a"
)
IF "%PID%"=="" (
    echo -     Nenhum processo usando a porta 80 foi encontrado.
) ELSE (
    taskkill /f /pid %PID%
    IF ERRORLEVEL 1 (
        echo -     Erro ao encerrar o processo na porta 80
        exit 1
    ) ELSE (
        echo -     Processo antigo encerrado com sucesso
    )
)
%APACHE_BIN_FILE% -k restart

echo - FIM DO SCRIPT
exit 0