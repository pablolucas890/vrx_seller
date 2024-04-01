@echo off
call "%~dp0\utils.bat"

:killport
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%API_PORT%"') do (
    set PID=%%a
    goto :portfound
)

:portnoutfound
echo - Processo na porta %API_PORT% não encontrado.
goto :startapi

:portfound
echo - Encerrando o processo %PID% na porta %API_PORT%.
taskkill /F /PID %PID%

:startapi
start /B ruby "%OLD_DIR%\src\api.rb"
:end