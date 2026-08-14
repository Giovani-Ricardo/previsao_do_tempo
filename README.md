# previsão do tempo

Projeto composto por duas partes:

- **Front-end** (raiz do projeto): páginas estáticas (`index.html`, `previsao_tempo.html`) empacotadas com Webpack.
- **Server** (`server/`): API Express simples, usada pelo front-end (ex.: endpoint `/event_date` da contagem regressiva).

## Pré-requisitos

- [Node.js](https://nodejs.org/) **v18.12 ou superior** (o `webpack-dev-server` 5.x exige essa versão mínima; em versões mais antigas, como a v16, o `npm start` falha com `SyntaxError` em `wsl-utils`). Recomendado usar a v20 LTS.
  - Se usar [nvm](https://github.com/nvm-sh/nvm): `nvm install 20 && nvm use 20`
- npm (instalado junto com o Node.js)

## Como executar

### 1. Front-end

Na raiz do projeto, instale as dependências e suba o servidor de desenvolvimento:

```bash
npm install
npm start
```

Isso abre o front-end em modo desenvolvimento (com live reload) usando `webpack-dev-server`, por padrão em `http://localhost:8080`.

Para gerar a build de produção (saída em `dist/`):

```bash
npm run build
```

### 2. Server (API)

Em outro terminal, entre na pasta `server`, instale as dependências e inicie a API:

```bash
cd server
npm install
npm start
```

O servidor sobe em `http://localhost:3000` (ou na porta definida pela variável de ambiente `PORT`).

> O front-end espera que a API esteja rodando em `http://localhost:3000` para funcionalidades como a contagem regressiva (`js/app.js`).

## Scripts disponíveis

| Local | Comando | Descrição |
| --- | --- | --- |
| raiz | `npm start` | Sobe o front-end em modo dev com Webpack |
| raiz | `npm run build` | Gera a build de produção em `dist/` |
| `server/` | `npm start` | Sobe a API Express (`server/bin/www`) |
