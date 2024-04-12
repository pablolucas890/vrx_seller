@echo off
call "%~dp0\utils.bat"

echo - Desinstalando pacotes adicionais, nao interrompa o processo ate a finalizacao.

:apache

%APACHE_BIN_FILE% -k stop >NUL 2>&1
echo - Parando Apache HTTPD.
%APACHE_BIN_FILE% -k uninstall >NUL 2>&1
echo - Desinstalando Apache HTTPD.
%CHOCO_BIM_FILE% uninstall -y apache-httpd >NUL 2>&1


:removeplugin
echo - Removendo plugins do SketchUp.
rmdir "%LAST_SKETCHUP%\SketchUp\Plugins\Sketchup_VRX" /s /q >NUL 2>&1
rmdir "%LAST_SKETCHUP%\SketchUp\Plugins\environments" /s /q >NUL 2>&1
del "%LAST_SKETCHUP%\SketchUp\Plugins\Sketchup_VRX.rb" >NUL 2>&1
del "%LAST_SKETCHUP%\SketchUp\Plugins\README.md" >NUL 2>&1
del "%LAST_SKETCHUP%\SketchUp\Plugins\.gitignore" >NUL 2>&1
del "%LAST_SKETCHUP%\SketchUp\Plugins\command.txt" >NUL 2>&1

:rubyapi
echo - Parando API
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%API_PORT%"') do (
    set PID=%%a
    goto :portfound
)

:portnotfound
echo - Processo na porta %API_PORT% nao encontrado.
goto :uninstallruby

:portfound
echo - Encerrando o processo %PID% na porta %API_PORT%.
taskkill /F /PID %PID% >NUL 2>&1

:uninstallruby
echo - Desinstalando Ruby.
%CHOCO_BIM_FILE% uninstall -y ruby >NUL 2>&1

:end
