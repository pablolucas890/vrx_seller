@echo off
call "%~dp0\utils.bat"

:chocolatey
where choco >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Chocolatey nao encontrado
)

:apache
dir %APACHE_CONF_FOLDER% >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Apache nao encontrado
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":]:80"') do (
    set "PID=%%a"
)
IF "%PID%"=="" (
    echo - Nenhum processo usando a porta 80 foi encontrado.
)

:copyhtdocs
dir "%USERPROFILE%\AppData\Roaming\Apache24\htdocs\assets" >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Arquivos nao encontrados
)

:rewriteconf
findstr /c:"# VRX Configs" %HTTPD_CONF_FILE% > NUL || (
    echo - Conf nao encontrada
)

:installruby
where ruby >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Ruby nao encontrado
)

:plugin
for /D %%D in ("%SKETCHUP_BASE_FOLDER%*") do (
    set LAST_SKETCHUP=%%D
)
dir "%LAST_SKETCHUP%\SketchUp\Plugins\Sketchup_VRX" >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Plugin nao encontrado
)

:end