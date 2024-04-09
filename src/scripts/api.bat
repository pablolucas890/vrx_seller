@echo off
call "%~dp0\utils.bat"

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
%RUBY_BIN_FILE% "%OLD_DIR%\src\api.rb"
:end