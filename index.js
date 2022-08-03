const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

const talker = './talker.json';
const validEmail = /.{2,20}@.*\.com/;
const validDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

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

app.get('/talker', async (_req, res) => {
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);
  if (fileJson.length === 0) return res.status(200).send([]);
  return res.status(200).send(fileJson);
});

const verifyName = (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
    if (name.length < 3) {
 return res.status(400).json({ 
      message: 'O "name" deve ter pelo menos 3 caracteres', 
    });
  }
  next();
};

const verifyAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
 return res.status(400).json({
    message: 'A pessoa palestrante deve ser maior de idade',
  }); 
}
  next();
};

const verifyAuthorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length < 16) return res.status(401).json({ message: 'Token inválido' });
  next();
};

const verifyTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });

  next();
};

const verifyWatchedAt = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  if (!validDate.test(watchedAt)) {
 return res.status(400).json({
    message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
  }); 
}
  next();
};

const verifyRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (Number(rate) < 1 || Number(rate) > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    }); 
  }
  if (!rate) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  next();
};

app.post('/talker', verifyTalk, verifyAuthorization, verifyName,
verifyAge, verifyRate, verifyWatchedAt, async (req, res) => {
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

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);
    const selectedTalker = fileJson.find((f) => f.id === Number(id));
    if (!selectedTalker) {
 return res.status(404).json({ 
      message: 'Pessoa palestrante não encontrada', 
    }); 
}
  return res.status(200).json(selectedTalker); 
});

app.put('/talker/:id', verifyTalk, verifyAuthorization, verifyName,
verifyAge, verifyRate, verifyWatchedAt, async (req, res) => {
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

app.delete('/talker/:id', verifyAuthorization, async (req, res) => {
  const { id } = req.params;
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);

  const talkerIndex = fileJson.findIndex((f) => f.id === Number(id));
  
  fileJson.splice(talkerIndex, 1);
  const newJson = JSON.stringify(fileJson);
  await fs.writeFile(talker, newJson);
  res.status(204).end();
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
