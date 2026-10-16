function notFound(req, res) {
  res.status(404).render('404', {
    title: 'Страница не найдена',
    url: req.originalUrl,
  });
}

function errorHandler(err, req, res, next) {
  console.error('Ошибка сервера:', err.message);

  res.status(500).render('500', {
    title: 'Ошибка сервера',
    message: err.message,
  });
}

module.exports = { notFound, errorHandler };
