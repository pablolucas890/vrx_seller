@echo off
call "%~dp0\utils.bat"

:enviroments
echo -   Baixando arquivos de ambiente
for /l %%i in (1,1,7) do (
    IF not exist "%LAST_SKETCHUP%\SketchUp\Plugins\environments\env%%i.skp" (
        echo - Enviroment %%i ausente, realizando o download...
        wget --no-check-certificate "%DOWNLOAD_URL%/env%%i.skp" -O "%LAST_SKETCHUP%\SketchUp\Plugins\environments\env%%i.skp" >NUL 2>&1
        if %ERRORLEVEL% neq 0 (
            echo !!! ERRO Falha ao baixar o arquivo. verifique a conexao ou contate o suporte !!!
            exit 1
        ) else (
            echo Download %%i/7 concluido com sucesso.
        )
    )
)

echo - FIM DO SCRIPT
:end