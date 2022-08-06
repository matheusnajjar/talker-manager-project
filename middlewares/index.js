const talker = './talker.json';
const validEmail = /.{2,20}@.*\.com/;
const validDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
const fs = require('fs').promises;

const verifyJson = async (_req, res, next) => {
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);
  if (fileJson.length === 0) return res.status(200).send([]);

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

const verifyAuthorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length < 16) return res.status(401).json({ message: 'Token inválido' });
  next();
};

const verifyEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!validEmail.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  
  next();
};

const verifyPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

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

const verifyTalkerById = async (req, res, next) => {
  const { id } = req.params;
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);
  const selectedTalker = fileJson.find((f) => f.id === Number(id));

  if (!selectedTalker) {
 return res.status(404).json({
    message: 'Pessoa palestrante não encontrada',
  }); 
}

  next();
};

const verifyQuery = async (req, res, next) => {
  const { q } = req.query;
  const file = await fs.readFile(talker);
  const fileJson = await JSON.parse(file);

  const result = fileJson.filter((f) => f.name.includes(q));

  if (!q) return res.status(200).json(fileJson);

  if (!result) return res.status(200).json([]);

  next();
};

module.exports = {
  verifyJson,
  verifyAge,
  verifyName,
  verifyAuthorization,
  verifyEmail,
  verifyPassword,
  verifyTalk,
  verifyWatchedAt,
  verifyRate,
  verifyTalkerById,
  verifyQuery,
};
