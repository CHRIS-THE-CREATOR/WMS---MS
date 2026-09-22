const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Banco de dados (SQLite) ---
const db = new Database(path.join(__dirname, '5w2h.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS planos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    o_que TEXT NOT NULL,
    por_que TEXT,
    onde TEXT,
    quando TEXT,
    quem TEXT,
    como TEXT,
    quanto_custa TEXT,
    status TEXT DEFAULT 'pendente',
    criado_em TEXT DEFAULT (datetime('now')),
    atualizado_em TEXT DEFAULT (datetime('now'))
  )
`);

// --- Rotas da API ---

// Listar todos os planos
app.get('/api/planos', (req, res) => {
  const planos = db.prepare('SELECT * FROM planos ORDER BY id DESC').all();
  res.json(planos);
});

// Buscar um plano
app.get('/api/planos/:id', (req, res) => {
  const plano = db.prepare('SELECT * FROM planos WHERE id = ?').get(req.params.id);
  if (!plano) return res.status(404).json({ erro: 'Plano nao encontrado' });
  res.json(plano);
});

// Criar plano
app.post('/api/planos', (req, res) => {
  const { o_que, por_que, onde, quando, quem, como, quanto_custa, status } = req.body;

  if (!o_que) {
    return res.status(400).json({ erro: 'O campo "O que" e obrigatorio' });
  }

  const stmt = db.prepare(`
    INSERT INTO planos (o_que, por_que, onde, quando, quem, como, quanto_custa, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    o_que, por_que || '', onde || '', quando || '',
    quem || '', como || '', quanto_custa || '', status || 'pendente'
  );

  const novoPlano = db.prepare('SELECT * FROM planos WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(novoPlano);
});

// Atualizar plano
app.put('/api/planos/:id', (req, res) => {
  const existente = db.prepare('SELECT * FROM planos WHERE id = ?').get(req.params.id);
  if (!existente) return res.status(404).json({ erro: 'Plano nao encontrado' });

  const { o_que, por_que, onde, quando, quem, como, quanto_custa, status } = req.body;

  db.prepare(`
    UPDATE planos SET
      o_que = ?, por_que = ?, onde = ?, quando = ?,
      quem = ?, como = ?, quanto_custa = ?, status = ?,
      atualizado_em = datetime('now')
    WHERE id = ?
  `).run(
    o_que ?? existente.o_que,
    por_que ?? existente.por_que,
    onde ?? existente.onde,
    quando ?? existente.quando,
    quem ?? existente.quem,
    como ?? existente.como,
    quanto_custa ?? existente.quanto_custa,
    status ?? existente.status,
    req.params.id
  );

  const atualizado = db.prepare('SELECT * FROM planos WHERE id = ?').get(req.params.id);
  res.json(atualizado);
});

// Excluir plano
app.delete('/api/planos/:id', (req, res) => {
  const info = db.prepare('DELETE FROM planos WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Plano nao encontrado' });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor 5W2H rodando em http://localhost:${PORT}`);
});
