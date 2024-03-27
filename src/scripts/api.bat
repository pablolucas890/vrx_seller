@echo off

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
cd ..
cd ..
set OLD_DIR=%CD%
set PORTA=4567

:kill
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORTA%"') do (
    set PID=%%a
    goto :found
)
:notfound
echo Processo na porta %PORTA% não encontrado.
goto :start
:found
echo Encerrando o processo %PID% na porta %PORTA%.
taskkill /F /PID %PID%

:start
start /B ruby "%OLD_DIR%\src\api.rb"