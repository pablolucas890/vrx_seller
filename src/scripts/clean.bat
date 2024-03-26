@echo off

set APACHE_BIN_FILE=%USERPROFILE%\AppData\Roaming\Apache24\bin\httpd.exe
set PORTA=4567

:apache
%APACHE_BIN_FILE% -k stop
%APACHE_BIN_FILE% -k uninstall
choco uninstall -y apache-httpd


:ruby
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORTA%"') do (
    set PID=%%a
    goto :found
)
:notfound
echo Processo na porta %PORTA% não encontrado.
goto :end
:found
echo Encerrando o processo %PID% na porta %PORTA%.
taskkill /F /PID %PID%
choco uninstall -y ruby

:end
