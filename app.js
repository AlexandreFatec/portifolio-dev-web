const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'
app.set('view engine', 'ejs'); // Define EJS como o motor de template

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
