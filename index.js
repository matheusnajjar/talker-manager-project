const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const middlewares = require('./middlewares/');

const talker = './talker.json';

const app = express();
app.use(bodyParser.json());

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/talker/search', middlewares.verifyAuthorization, middlewares.verifyQuery,
async (req, res) => {
  const { q } = req.query;
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);

  const result = fileJson.filter((f) => f.name.includes(q));

  return res.status(200).json(result);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.post('/login', middlewares.verifyEmail,
middlewares.verifyPassword, (_req, res) => {
  const token = generateToken();
  
  return res.status(200).json({ token });
});

app.get('/talker', middlewares.verifyJson, async (_req, res) => {
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);

  return res.status(200).send(fileJson);
});

app.get('/talker/:id', middlewares.verifyTalkerById, async (req, res) => {
  const { id } = req.params;
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);
  const selectedTalker = fileJson.find((f) => f.id === Number(id));
  return res.status(200).json(selectedTalker); 
});

app.use(middlewares.verifyAuthorization);

app.delete('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);

  const talkerIndex = fileJson.findIndex((f) => f.id === Number(id));
  
  fileJson.splice(talkerIndex, 1);
  const newJson = JSON.stringify(fileJson);
  await fs.writeFile(talker, newJson);
  res.status(204).end();
});

app.use(middlewares.verifyAge);
app.use(middlewares.verifyName);
app.use(middlewares.verifyTalk);
app.use(middlewares.verifyRate);
app.use(middlewares.verifyWatchedAt);

app.post('/talker', async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const file = await fs.readFile('talker.json');
  const fileJson = await JSON.parse(file);

  const newTalker = {
    id: fileJson.length + 1,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };

  const newFile = [...fileJson, newTalker];
  const newFileJson = JSON.stringify(newFile);
  fs.writeFile('talker.json', newFileJson);
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);
  
  const newFile = { name, age, id: +id, talk };
  
  const myFiles = fileJson.map((f) => {
    if (f.id === +id) {
      return newFile;
    }
    return f;
  });

  const newJson = JSON.stringify(myFiles);
  await fs.writeFile(talker, newJson);
  return res.status(200).json(newFile);
});

app.listen(PORT, () => {
  console.log('Online');
});
