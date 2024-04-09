@echo off
call "%~dp0\utils.bat"

:apache
%APACHE_BIN_FILE% -k stop
%APACHE_BIN_FILE% -k uninstall
%CHOCO_BIM_FILE% uninstall -y apache-httpd


:rubyapi
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%API_PORT%"') do (
    set PID=%%a
    goto :portfound
)

:portnotfound
echo - Processo na porta %API_PORT% não encontrado.
goto :removeplugin

:portfound
echo - Encerrando o processo %PID% na porta %API_PORT%.
taskkill /F /PID %PID%
%CHOCO_BIM_FILE% uninstall -y ruby

:removeplugin
rmdir "%LAST_SKETCHUP%\SketchUp\Plugins\Sketchup_VRX" /s /q
rmdir "%LAST_SKETCHUP%\SketchUp\Plugins\environments" /s /q
del "%LAST_SKETCHUP%\SketchUp\Plugins\Sketchup_VRX.rb"
del "%LAST_SKETCHUP%\SketchUp\Plugins\README.md"
del "%LAST_SKETCHUP%\SketchUp\Plugins\.gitignore"
del "%LAST_SKETCHUP%\SketchUp\Plugins\command.txt"

:end
