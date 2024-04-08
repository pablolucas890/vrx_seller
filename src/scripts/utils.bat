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
set DOWNLOAD_URL="http://15.229.252.34:8080/download"
set HTDOCS_FOLDER=%USERPROFILE%\AppData\Roaming\Apache24\htdocs
set RUBY_FOLDER="C:\tools\ruby33\bin\bundler.bat"
set GEM_BIN_FILE="C:\tools\ruby33\bin\gem.cmd"
set RUBY_BIN_FILE="C:\tools\ruby33\bin\ruby.exe"

for /D %%D in ("%SKETCHUP_BASE_FOLDER%*") do (
    set LAST_SKETCHUP=%%D
)

:end