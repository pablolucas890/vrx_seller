@echo off
call "%~dp0\utils.bat"

:installruby
echo - Instalando o Ruby
choco install -y ruby --version=3.3.0.1 --force
IF %ERRORLEVEL% NEQ 0 (
    echo - Falha ao instalar o Ruby. Por favor, instale manualmente e tente novamente.
    exit 1
)
echo - O Ruby foi instalado com sucesso.


:copymaterials
echo - Copiando os arquivos de materiais
xcopy "%OLD_DIR%\build\assets\img\materials\*" "%LAST_SKETCHUP%\SketchUp\Materials" /E /I /Y >NUL 2>&1

echo - Baixando wget
choco install wget -y --force

:plugin
dir "%LAST_SKETCHUP%\SketchUp\Plugins\Sketchup_VRX" >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    mkdir "%LAST_SKETCHUP%\SketchUp\Plugins"
    echo "%LAST_SKETCHUP%\SketchUp\Plugins"
    echo - Baixando Plugin VRX
    wget %REPO_URL% -O %ZIP_FILE%
    echo -   Extraindo arquivo zip...
    tar -xf %ZIP_FILE% -C "%LAST_SKETCHUP%\SketchUp\Plugins"
    xcopy "%LAST_SKETCHUP%\SketchUp\Plugins\vrx_plugin-main\*" "%LAST_SKETCHUP%\SketchUp\Plugins" /E /I /Y >NUL 2>&1
    del %ZIP_FILE%
    rmdir "%LAST_SKETCHUP%\SketchUp\Plugins\vrx_plugin-main" /s /q
    echo - Plugin VRX foi instalado com sucesso
) ELSE (
    echo - Plugin VRX ja esta instalado
)

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

goto :listgems

:installGem
%GEM_BIN_FILE% list | findstr %1 >NUL
IF %ERRORLEVEL% NEQ 0 (
    echo -   Instalando a gem %1
    gem install %1
) ELSE (
    echo -   Gem %1 ja esta instalada
)
goto :end

:listgems
echo - Instalando as gems
FOR %%G IN (sinatra httparty sinatra-cors json http uri rackup) DO (
    CALL :installGem %%G
)

echo - FIM DO SCRIPT
:end