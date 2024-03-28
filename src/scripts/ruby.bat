@echo off

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
cd ..
cd ..
set OLD_DIR=%CD%
set "SKETCHUP_BASE_FOLDER=%USERPROFILE%\AppData\Roaming\SketchUp\SketchUp "
set REPO_URL=https://github.com/Jadyla/vrx_plugin/archive/refs/heads/main.zip
set ZIP_FILE="%USERPROFILE%\Downloads\vrx_plugin.zip"
set ENV_URL="http://192.168.68.131:8080/environments"

echo - Verificando se o Ruby esta instalado
where ruby >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo - Instalando o Ruby
    choco install -y ruby --version 2.7.2
    IF %ERRORLEVEL% NEQ 0 (
        echo - Falha ao instalar o Ruby. Por favor, instale manualmente e tente novamente.
        exit 1
    )
    echo - O Ruby foi instalado com sucesso.
) ELSE (
    echo - Ruby ja esta instalado
)

echo - Copiando os arquivos de materiais
for /D %%D in ("%SKETCHUP_BASE_FOLDER%*") do (
    set last_folder=%%D
)
xcopy "%OLD_DIR%\build\assets\img\materials\*" "%last_folder%\SketchUp\Materials" /E /I /Y >NUL 2>&1

echo - Fazendo Download do Plugin VRX
dir "%last_folder%\SketchUp\Plugins\Sketchup_VRX" >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo "%last_folder%\SketchUp\Plugins"
    echo -   Baixando wget
    choco install wget -y
    echo -   Baixando Plugin
    wget %REPO_URL% -O %ZIP_FILE%
    echo -   Extraindo arquivo zip...
    tar -xf %ZIP_FILE% -C "%last_folder%\SketchUp\Plugins"
    xcopy "%last_folder%\SketchUp\Plugins\vrx_plugin-main\*" "%last_folder%\SketchUp\Plugins" /E /I /Y >NUL 2>&1
    del %ZIP_FILE%
    rmdir "%last_folder%\SketchUp\Plugins\vrx_plugin-main" /s /q
    wget --no-check-certificate "%ENV_URL%/env1.skp" -O "%last_folder%\SketchUp\Plugins\environments\env1.skp"
    wget --no-check-certificate "%ENV_URL%/env2.skp" -O "%last_folder%\SketchUp\Plugins\environments\env2.skp"
    wget --no-check-certificate "%ENV_URL%/env3.skp" -O "%last_folder%\SketchUp\Plugins\environments\env3.skp"
    wget --no-check-certificate "%ENV_URL%/env4.skp" -O "%last_folder%\SketchUp\Plugins\environments\env4.skp"
    wget --no-check-certificate "%ENV_URL%/env5.skp" -O "%last_folder%\SketchUp\Plugins\environments\env5.skp"
    wget --no-check-certificate "%ENV_URL%/env6.skp" -O "%last_folder%\SketchUp\Plugins\environments\env6.skp"
    wget --no-check-certificate "%ENV_URL%/env7.skp" -O "%last_folder%\SketchUp\Plugins\environments\env7.skp"
    echo - Plugin VRX foi instalado com sucesso
) ELSE (
    echo - Plugin VRX ja esta instalado
)
echo - FIM DO SCRIPT
:end