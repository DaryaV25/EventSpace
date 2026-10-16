// Подключение к базе данных SQLite.
// В базе хранятся только логи событий (каждый запрос к серверу).
// Сами данные о мероприятиях хранятся в памяти (см. data/events.js).

const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'logs.db'));

// Таблица для логирования событий
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    method TEXT NOT NULL,
    url TEXT NOT NULL,
    status INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const insertLog = db.prepare(
  'INSERT INTO logs (method, url, status, duration, created_at) VALUES (?, ?, ?, ?, ?)',
);

const selectLogs = db.prepare('SELECT * FROM logs ORDER BY id DESC LIMIT ?');

// Записать одно событие (запрос) в базу
function addLog({ method, url, status, duration }) {
  insertLog.run(
    method,
    url,
    status,
    duration,
    new Date().toLocaleString('ru-RU'),
  );
}

// Получить последние события из базы
function getLogs(limit = 50) {
  return selectLogs.all(limit);
}

module.exports = { addLog, getLogs };
