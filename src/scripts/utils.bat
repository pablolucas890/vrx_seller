@echo off

:begin
cd /d "%~dp0"
cd ..
cd ..

:constats
set OLD_DIR=%CD%
set APACHE_BIN_FILE=%USERPROFILE%\AppData\Roaming\Apache24\bin\httpd.exe
set APACHE_CONF_FOLDER=%USERPROFILE%\AppData\Roaming\Apache24\conf
set HTTPD_CONF_FILE=%APACHE_CONF_FOLDER%\httpd.conf
set API_PORT=4567
set "SKETCHUP_BASE_FOLDER=%USERPROFILE%\AppData\Roaming\SketchUp\SketchUp "
set REPO_URL=https://github.com/Jadyla/vrx_plugin/archive/refs/heads/main.zip
set ZIP_FILE="%USERPROFILE%\Downloads\vrx_plugin.zip"
set DOWNLOAD_URL="http://192.168.68.131:8080/download"
set HTDOCS_FOLDER=%USERPROFILE%\AppData\Roaming\Apache24\htdocs

for /D %%D in ("%SKETCHUP_BASE_FOLDER%*") do (
    set LAST_SKETCHUP=%%D
)

:end