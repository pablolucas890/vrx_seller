@echo off
call "%~dp0\utils.bat"

:installruby
where ruby >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Instalando o Ruby
    choco install -y ruby --force
    IF %ERRORLEVEL% NEQ 0 (
        echo - Falha ao instalar o Ruby. Por favor, instale manualmente e tente novamente.
        exit 1
    )
    echo - O Ruby foi instalado com sucesso.
) ELSE (
    echo - Ruby ja esta instalado
)

:copymaterials
echo - Copiando os arquivos de materiais
for /D %%D in ("%SKETCHUP_BASE_FOLDER%*") do (
    set LAST_SKETCHUP=%%D
)
xcopy "%OLD_DIR%\build\assets\img\materials\*" "%LAST_SKETCHUP%\SketchUp\Materials" /E /I /Y >NUL 2>&1

:plugin
dir "%LAST_SKETCHUP%\SketchUp\Plugins\Sketchup_VRX" >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo "%LAST_SKETCHUP%\SketchUp\Plugins"
    echo - Baixando wget
    choco install wget -y --force
    echo - Baixando Plugin VRX
    wget %REPO_URL% -O %ZIP_FILE%
    echo -   Extraindo arquivo zip...
    tar -xf %ZIP_FILE% -C "%LAST_SKETCHUP%\SketchUp\Plugins"
    xcopy "%LAST_SKETCHUP%\SketchUp\Plugins\vrx_plugin-main\*" "%LAST_SKETCHUP%\SketchUp\Plugins" /E /I /Y >NUL 2>&1
    del %ZIP_FILE%
    rmdir "%LAST_SKETCHUP%\SketchUp\Plugins\vrx_plugin-main" /s /q
    echo -   Baixando arquivos de ambiente
    for %%i in (1 2 3 4 5 6 7) do (
        wget --no-check-certificate "%DOWNLOAD_URL%/env%%i.skp" -O "%LAST_SKETCHUP%\SketchUp\Plugins\environments\env%%i.skp"
    )
    echo - Plugin VRX foi instalado com sucesso
) ELSE (
    echo - Plugin VRX ja esta instalado
)

echo - FIM DO SCRIPT
:end