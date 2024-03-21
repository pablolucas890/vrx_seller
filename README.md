# vrx_seller

## Enviroment

- Eslist configs:
  - Install extensions (Eslint) and (Prettier ESLint)
  - edit Settings.json for vscode with
    ```
    "[javascript]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true,
            "source.organizeImports": true
        }
    },
    "[javascriptreact]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true,
            "source.organizeImports": true
        }
    },
    "[typescript]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true,
            "source.organizeImports": true
        }
    },
    "[typescriptreact]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true,
            "source.organizeImports": true,
        },
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    ```

## Development

- Node Version: `v16.20.0`
  - Install `nvm` on machine to controll the node versions
  - `nvm install 16.20.0`
  - `nvm use 16.20.0`
- Install packages:   `npm install`
- Start server: `npm run start`
- Build: `npm run build`
- Format code with Prettier: `npm run format`
- Check sintax and style on projet: `npm run lint`
- Fix sintax and style on projet with eslit: `npm run lint:fix`

## Production

- Build React App:
    - `npm run build`
- Generate installer file with electron:
    - `npm run pack:linux|win`

### Shell process

- Install and execute Apache
- Configure Rules at `/etc/apache2/sites-available/000-default.conf` with:
    ```
    <Directory "/var/www/html">
        RewriteEngine on
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]
        RewriteRule ^ index.html [L]
    </Directory>
    ```
- Copy public files to `www` folder