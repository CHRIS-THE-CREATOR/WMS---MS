# 5W2H — Módulo do WMS

Aplicação web completa (front-end + back-end + banco de dados) para gerenciar planos de ação no formato **5W2H**: O quê, Por quê, Onde, Quando, Quem, Como e Quanto custa.

## Stack

- **Back-end:** Node.js + Express
- **Banco de dados:** SQLite (via `better-sqlite3`)
- **Front-end:** HTML, CSS e JavaScript puro (sem framework)

## Como rodar localmente

```bash
npm install
npm start
```

Depois acesse **http://localhost:3000**.

O banco de dados (`5w2h.db`) é criado automaticamente na primeira execução.

## Estrutura do projeto

```
5w2h-app/
├── server.js          # servidor Express + rotas da API + SQLite
├── package.json
├── public/
│   ├── index.html      # formulário e listagem
│   ├── style.css
│   └── app.js           # consumo da API
└── .gitignore
```

## API

| Método | Rota              | Descrição              |
|--------|-------------------|-------------------------|
| GET    | /api/planos       | Lista todos os planos   |
| GET    | /api/planos/:id   | Busca um plano          |
| POST   | /api/planos       | Cria um plano           |
| PUT    | /api/planos/:id   | Atualiza um plano       |
| DELETE | /api/planos/:id   | Exclui um plano         |

## Como enviar para o GitHub

1. Crie um repositório vazio no GitHub (sem README, sem .gitignore — já temos).
2. No terminal, dentro da pasta `5w2h-app`:

```bash
git init
git add .
git commit -m "Primeira versão do app 5W2H"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

Troque `SEU-USUARIO` e `NOME-DO-REPOSITORIO` pelos dados do seu repositório.

## Próximos passos sugeridos

- Autenticação de usuários
- Integração com o restante do WMS (ex: vincular plano a um armazém/setor real)
- Deploy (Render, Railway, Fly.io, etc.)
