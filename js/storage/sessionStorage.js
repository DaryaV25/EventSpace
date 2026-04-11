// js/storage/sessionStorage.js

export function saveToSession(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Ошибка сохранения в sessionStorage:', error);
  }
}

export function getFromSession(key) {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Ошибка чтения из sessionStorage:', error);
    return null;
  }
}
