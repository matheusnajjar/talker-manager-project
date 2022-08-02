const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');

const talker = 'talker.json';
const validEmail = /.{2,20}@.*\.com/;

const app = express();
app.use(bodyParser.json());

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  fs.readFile(talker, 'utf-8', (_err, data) => {
    if (data.length === 0) return [];
    res.status(200).send(JSON.parse(data));
  });
});

app.get('/talker/:id', (req, res) => {
  fs.readFile(talker, 'utf-8', (_err, data) => {
    const { id } = req.params;
    const selectedTalker = JSON.parse(data).find((t) => t.id === Number(id));
    if (!selectedTalker) {
 return res.status(404).json({ 
      message: 'Pessoa palestrante não encontrada', 
    }); 
}

  return res.status(200).json(selectedTalker); 
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!validEmail.test(email)) {
    console.log(email, password);
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  return res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
