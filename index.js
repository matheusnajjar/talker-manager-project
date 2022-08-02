const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const talker = 'talker.json';

const app = express();
app.use(bodyParser.json());

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

app.listen(PORT, () => {
  console.log('Online');
});
