@echo off
call "%~dp0\utils.bat"

:apache
%APACHE_BIN_FILE% -k stop
%APACHE_BIN_FILE% -k uninstall
choco uninstall -y apache-httpd


:rubyapi
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%API_PORT%"') do (
    set PID=%%a
    goto :portfound
)

:portnotfound
echo - Processo na porta %API_PORT% não encontrado.
goto :end

:portfound
echo - Encerrando o processo %PID% na porta %API_PORT%.
taskkill /F /PID %PID%
choco uninstall -y ruby

:end
