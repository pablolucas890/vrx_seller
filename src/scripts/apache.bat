@echo off
call "%~dp0\utils.bat"

:chocolatey
dir %CHOCO_BIM_FILE% >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Instalando o Chocolatey
    cmd /c @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
    echo - O Chocolatey foi instalado com sucesso.
) ELSE (
    echo - Chocolatey ja esta instalado
)

:apache
dir %APACHE_CONF_FOLDER% >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Instalando o Apache HTTPD
    %CHOCO_BIM_FILE% install -y apache-httpd --params '/Port:80' --force
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

:copyhtdocs
dir "%HTDOCS_FOLDER%\assets" >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Copiando os arquivos da build para o diretorio do Apache
    xcopy /s /y "%OLD_DIR%\build\" "%HTDOCS_FOLDER%\" >NUL 2>&1
) ELSE (
    echo - Arquivos ja estao no diretorio do Apache
)

:rewriteconf
findstr /c:"# VRX Configs" %HTTPD_CONF_FILE% > NUL || (
    echo - Reescrevendo configuracoes do httpd
    echo # VRX Configs >> %HTTPD_CONF_FILE%
    echo LoadModule rewrite_module modules/mod_rewrite.so >> "%HTTPD_CONF_FILE%"
    echo ^<Directory "${SRVROOT}/htdocs"^> >> "%HTTPD_CONF_FILE%"
    echo Options Indexes FollowSymLinks >> "%HTTPD_CONF_FILE%"
    echo AllowOverride All >> "%HTTPD_CONF_FILE%"
    echo Require all granted >> "%HTTPD_CONF_FILE%"
    echo ^</Directory^> >> "%HTTPD_CONF_FILE%"
)

:restartapache
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
:end