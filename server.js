const path = require('path');
const express = require('express');

const db = require('./db');
const events = require('./data/events');
const logger = require('./middleware/logger');
const { auth, requireAuth } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errors');
const validateEvent = require('./middleware/validateEvent');

const app = express();
const PORT = 3000;

// ---------- 1. Настройка шаблонизатора EJS ----------
app.set('view engine', 'ejs');
app.set('views', './views');

// ---------- 2. Встроенные middleware Express ----------
app.use(express.static(path.join(__dirname, 'public'))); // css и изображения
app.use(express.urlencoded({ extended: true })); // разбор данных формы
app.use(express.json());

// ---------- 3. Кастомные middleware ----------
app.use(logger); // логирует метод, URL и время запроса (консоль + база данных)
app.use(auth); // имитация авторизации

// ---------- 4. Маршруты ----------
// Главная страница — список мероприятий
app.get('/', (req, res) => {
  res.render('index', { title: 'Мероприятия', events: events.getAll() });
});

// Детальная страница мероприятия
app.get('/item/:id', (req, res, next) => {
  const event = events.getById(req.params.id);

  if (!event) {
    return next(); // передаём управление в middleware 404
  }

  res.render('item', { title: event.title, event });
});

// Форма добавления мероприятия (только для авторизованных)
app.get('/add', requireAuth, (req, res) => {
  res.render('add', { title: 'Добавить мероприятие', errors: {}, values: {} });
});

// Обработка формы: проверка данных, добавление в массив, редирект на главную
app.post('/add', requireAuth, validateEvent, (req, res) => {
  events.add(req.event);
  res.redirect('/' + res.locals.authQuery);
});

// Имитация страницы входа
app.get('/login', (req, res) => {
  res.render('login', { title: 'Вход' });
});

// Журнал событий из базы данных (только для авторизованных)
app.get('/logs', requireAuth, (req, res) => {
  res.render('logs', { title: 'Журнал событий', logs: db.getLogs() });
});

app.get('/error', (req, res, next) => {
  next(new Error('Тестовая ошибка сервера'));
});

// ---------- 5. Обработка ошибок ----------
app.use(notFound); // 404
app.use(errorHandler); // 500

app.listen(PORT, () => {
  console.log(`EventSpace запущен: http://localhost:${PORT}`);
});
