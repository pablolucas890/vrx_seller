@echo off

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
cd ..
cd ..
set OLD_DIR=%CD%
set "SKETCHUP_BASE_FOLDER=%USERPROFILE%\AppData\Roaming\SketchUp\SketchUp "

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
    xcopy "%OLD_DIR%\build\assets\img\materials\*" "%%D\SketchUp\Materials" /E /I /Y >NUL 2>&1
)

echo - FIM DO SCRIPT
:end