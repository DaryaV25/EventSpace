// Ограничение ввода в полях формы добавления мероприятия.
// Правила работают уже во время ввода: лишние символы не появляются,
// а длину строки сайт обрезает сам (не только подсказка рядом с полем).

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form');
  if (!form) return;

  // Правила текстовых полей: сколько символов можно ввести и какие символы запрещены
  const rules = {
    title: { max: 60, forbidden: /[^\p{L}\p{N}\s.,!?;:()«»"'\-–—№%@+]/gu },
    city: { max: 30, forbidden: /[^\p{L}\s-]/gu },
    address: { max: 60, forbidden: /[^\p{L}\p{N}\s.,\-/№]/gu },
    description: { max: 300, forbidden: null },
  };

  Object.keys(rules).forEach(function (name) {
    const field = form.elements[name];
    if (!field) return;

    const rule = rules[name];

    field.addEventListener('input', function () {
      limitField(field, rule.max, rule.forbidden);
      updateCounter(name, field.value.length, rule.max);
    });

    updateCounter(name, field.value.length, rule.max);
  });

  // Поле стоимости: деньги в формате 00,00 (2 цифры до запятой и 2 после)
  const price = form.elements.price;
  if (price) {
    price.addEventListener('input', function () {
      const caret = price.selectionStart;
      const digitsBefore = price.value.slice(0, caret).replace(/\D/g, '').length;

      price.value = maskMoney(price.value);

      const pos = Math.min(digitsBefore, price.value.length);
      price.setSelectionRange(pos, pos);
      updateCounter('price', price.value.length, 5);
    });

    // После выхода из поля запись приводится к полному виду 00,00
    price.addEventListener('blur', function () {
      price.value = formatMoney(price.value);
      updateCounter('price', price.value.length, 5);
    });
  }

  // Перед отправкой формы стоимость тоже приводится к виду 00,00
  form.addEventListener('submit', function () {
    if (price) price.value = formatMoney(price.value);
  });

  // Убирает запрещённые символы и обрезает строку до нужной длины.
  // Курсор остаётся на месте, даже если правка была в середине текста.
  function limitField(field, max, forbidden) {
    const raw = field.value;
    const caret = field.selectionStart;

    const beforeCaret = cut(raw.slice(0, caret), max, forbidden);
    const clean = cut(raw, max, forbidden);

    field.value = clean;

    const pos = Math.min(beforeCaret.length, clean.length);
    field.setSelectionRange(pos, pos);
  }

  function cut(value, max, forbidden) {
    const clean = forbidden ? value.replace(forbidden, '') : value;
    return clean.slice(0, max);
  }

  // Только цифры и запятая: максимум 2 цифры до запятой и 2 после
  function maskMoney(value) {
    const clean = value.replace(/\./g, ',').replace(/[^\d,]/g, '');
    const parts = clean.split(',');

    const int = parts[0].slice(0, 2);
    if (parts.length === 1) return int;

    const dec = parts.slice(1).join('').slice(0, 2);
    return int + ',' + dec;
  }

  // Приведение к виду 00,00: 5 -> 05,00, 12,5 -> 12,50
  function formatMoney(value) {
    if (value.trim() === '') return '';

    const parts = maskMoney(value).split(',');
    const int = parts[0].padStart(2, '0');
    const dec = (parts[1] || '').padEnd(2, '0');

    return int + ',' + dec;
  }

  // Счётчик введённых символов рядом с полем
  function updateCounter(name, length, max) {
    const counter = document.getElementById('count-' + name);
    if (!counter) return;

    counter.textContent = length + ' / ' + max;
    counter.classList.toggle('form__count--max', length >= max);
  }
});
