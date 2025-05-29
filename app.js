const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config(); 

const port = 3000;

// Configuração de arquivos estáticos e EJS
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

// Rota principal (renderiza o EJS com projetos do banco)
app.get('/', (req, res) => {
  db.query('SELECT * FROM projetos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.render('index', {
      title: 'Meu Portfólio',
      projetos: results
    });
  });
});

// ROTAS API (CRUD)

// CREATE
app.post('/projetos', (req, res) => {
  const { nome, descricao } = req.body;
  const sql = 'INSERT INTO projetos (nome, descricao) VALUES (?, ?)';
  db.query(sql, [nome, descricao], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, nome, descricao });
  });
});

// READ TODOS
app.get('/projetos', (req, res) => {
  db.query('SELECT * FROM projetos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// READ POR ID
app.get('/projetos/:id', (req, res) => {
  db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send({ mensagem: 'Projeto não encontrado' });
    res.send(result[0]);
  });
});

// UPDATE
app.put('/projetos/:id', (req, res) => {
  const { nome, descricao } = req.body;
  const sql = 'UPDATE projetos SET nome = ?, descricao = ? WHERE id = ?';
  db.query(sql, [nome, descricao, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Projeto atualizado com sucesso' });
  });
});

// DELETE
app.delete('/projetos/:id', (req, res) => {
  db.query('DELETE FROM projetos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ mensagem: 'Projeto excluído com sucesso' });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
