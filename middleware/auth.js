function auth(req, res, next) {
  const authorized = req.query.auth === '1';

  req.user = {
    name: authorized ? 'Пользователь' : 'Гость',
    authorized,
  };

  // Делаем данные доступными во всех шаблонах (header.ejs, footer.ejs)
  res.locals.user = req.user;
  res.locals.authQuery = authorized ? '?auth=1' : '';

  next();
}

// Пропускает дальше только авторизованного пользователя
function requireAuth(req, res, next) {
  if (!req.user.authorized) {
    return res.redirect('/login');
  }
  next();
}

module.exports = { auth, requireAuth };
