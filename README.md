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

### Steps to install

- <a href='https://www.canva.com/design/DAGB8zlc_ow/FiyMdj1LXWxo6EirT0PDJA/view?utm_content=DA[…]_ow&utm_campaign=designshare&utm_medium=link&utm_source=editor'> Steps </a>
- <a href='https://github.com/pablolucas890/vrx_seller/raw/main/dist/VRX%20Setup%201.0.0.exe?download='> Program </a>