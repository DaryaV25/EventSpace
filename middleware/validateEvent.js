// Middleware проверки данных формы добавления мероприятия.
// Если есть ошибки — форма отображается снова вместе с сообщениями (статус 400).

// Допустимые изображения (значения поля select)
const IMAGES = ['/images/event1.png', '/images/event2.png', '/images/event3.png'];

// Регулярные выражения для проверок
const LETTERS = /\p{L}/u; // есть хотя бы одна буква
const ONLY_DIGITS = /^\d+$/; // строка состоит только из цифр
const CITY = /^[\p{L}\s-]+$/u; // только буквы, пробел и дефис
const MONEY = /^\d{1,2}(,\d{1,2})?$/; // деньги в формате 00,00
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/; // время в формате ЧЧ:ММ

function validateEvent(req, res, next) {
  // Значения полей без пробелов по краям — вернём их в форму при ошибке
  const values = {
    title: (req.body.title || '').trim(),
    date: (req.body.date || '').trim(),
    time: (req.body.time || '').trim(),
    city: (req.body.city || '').trim(),
    address: (req.body.address || '').trim(),
    price: String(req.body.price || '').trim(),
    image: req.body.image || '',
    description: (req.body.description || '').trim(),
  };

  const errors = {};

  // Название
  if (!values.title) errors.title = 'Укажите название мероприятия';
  else if (values.title.length < 3) errors.title = 'Минимум 3 символа';
  else if (values.title.length > 60) errors.title = 'Максимум 60 символов';
  else if (!LETTERS.test(values.title)) errors.title = 'Название должно содержать буквы';

  // Дата: только корректная дата и не в прошлом
  const today = new Date().toISOString().slice(0, 10);
  if (!values.date) errors.date = 'Укажите дату';
  else if (Number.isNaN(Date.parse(values.date))) errors.date = 'Некорректная дата';
  else if (values.date < today) errors.date = 'Дата не может быть в прошлом';

  // Время
  if (!values.time) errors.time = 'Укажите время';
  else if (!TIME.test(values.time)) errors.time = 'Время в формате ЧЧ:ММ';

  // Город: не пустой, не только цифры, только буквы/пробел/дефис
  if (!values.city) errors.city = 'Укажите город';
  else if (values.city.length < 2) errors.city = 'Минимум 2 символа';
  else if (values.city.length > 30) errors.city = 'Максимум 30 символов';
  else if (ONLY_DIGITS.test(values.city)) errors.city = 'Город не может состоять только из цифр';
  else if (!CITY.test(values.city)) errors.city = 'Только буквы, пробел и дефис';

  // Адрес: не пустой, не только цифры, должен содержать буквы
  if (!values.address) errors.address = 'Укажите адрес';
  else if (values.address.length < 5) errors.address = 'Минимум 5 символов';
  else if (values.address.length > 60) errors.address = 'Максимум 60 символов';
  else if (ONLY_DIGITS.test(values.address)) errors.address = 'Адрес не может состоять только из цифр';
  else if (!LETTERS.test(values.address)) errors.address = 'Адрес должен содержать буквы';

  // Стоимость: только деньги в формате 00,00, без минуса и лишних знаков
  if (values.price === '') errors.price = 'Укажите стоимость (00,00 — бесплатно)';
  else if (values.price.includes('-')) errors.price = 'Стоимость не может быть отрицательной';
  else if (!MONEY.test(values.price)) errors.price = 'Формат стоимости: 00,00 (две цифры до запятой и две после)';

  // Описание
  if (!values.description) errors.description = 'Укажите описание';
  else if (values.description.length < 10) errors.description = 'Минимум 10 символов';
  else if (values.description.length > 300) errors.description = 'Максимум 300 символов';

  // Изображение: только из списка
  if (!IMAGES.includes(values.image)) errors.image = 'Выберите изображение из списка';

  // Есть ошибки — возвращаем форму с сообщениями
  if (Object.keys(errors).length > 0) {
    return res.status(400).render('add', {
      title: 'Добавить мероприятие',
      errors,
      values,
    });
  }

  // Данные прошли проверку — передаём их в маршрут
  // Стоимость "05,00" превращаем в число 5 для хранения в массиве
  req.event = Object.assign({}, values, {
    price: Number(values.price.replace(',', '.')),
  });
  next();
}

module.exports = validateEvent;
