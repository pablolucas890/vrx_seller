#!/bin/bash

APACHE_FOLDER="/var/www/html"

if command -v apache2 &> /dev/null; then
    echo "Apache já está instalado no sistema."
else
  echo "Iniciando instalação do Apache..."
  sudo apt update
  sudo apt install apache2 -y
fi

sudo cp -r build/* $APACHE_FOLDER

sudo a2enmod rewrite
default_conf="/etc/apache2/sites-available/000-default.conf"
if grep -q "RewriteCond" "$default_conf"; then
    echo "RewriteCond already exists"
else
  echo "<Directory "$APACHE_FOLDER">
      RewriteEngine on
      RewriteCond %{REQUEST_FILENAME} -f [OR]
      RewriteCond %{REQUEST_FILENAME} -d
      RewriteRule ^ - [L]
      RewriteRule ^ index.html [L]
</Directory>" | sudo tee -a $default_conf
fi

sudo systemctl restart apache2

echo "Apache2 has been installed and configured successfully"
exit 0
