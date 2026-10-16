// Middleware логирования.
// Выводит метод, URL и время запроса в консоль и сохраняет каждое событие (запрос) в базу данных.

const db = require('../db');

function logger(req, res, next) {
  const start = Date.now();
  const time = new Date().toLocaleTimeString('ru-RU');

  console.log(`[${time}] ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    db.addLog({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start,
    });
  });

  next();
}

module.exports = logger;
