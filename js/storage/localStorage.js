// js/storage/localStorage.js

const CACHE_DURATION = 86400000;

export function saveEvents(key, data) {
  try {
    const item = {
      value: data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(item));
    console.log(`Данные сохранены в кэш: ${key} `);
  } catch (e) {
    console.error('Ошибка сохранения в LocalStorage:', e);
  }
}

export function getEvents(key) {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = Date.now();

    if (now - item.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      console.log(`Кэш устарел и удалён (${key})`);
      return null;
    }

    return item.value;
  } catch (e) {
    console.error('Ошибка чтения кэша:', e);
    return null;
  }
}

export function clearCache() {
  try {
    localStorage.clear();
    console.log('LocalStorage полностью очищен');
  } catch (e) {
    console.error('Ошибка очистки LocalStorage:', e);
  }
}
