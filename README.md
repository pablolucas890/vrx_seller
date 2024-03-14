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

- Build docker
  - `docker build -t registry.example.com/group/project/image .`
- Push Docker
  - `docker push registry.example.com/group/project/image`