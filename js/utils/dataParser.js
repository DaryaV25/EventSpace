// js/utils/dataParser.js

export function parseAPIEvents(data) {
  if (!data?._embedded?.events || !Array.isArray(data._embedded.events)) {
    console.warn('API вернул пустые данные или неверный формат');
    return [];
  }

  return data._embedded.events
    .filter((event) => event.dates?.start?.localDate) // отбрасываем события без даты
    .map((event) => {
      const start = event.dates?.start || {};

      return {
        title: event.name?.trim() || 'Без названия',
        date: start.localDate || null, // YYYY-MM-DD
        time: start.localTime || '19:00',
        city: event._embedded?.venues?.[0]?.city?.name || 'Warsaw',
        address: event._embedded?.venues?.[0]?.name || 'Event Venue',

        // Дополнительные полезные поля (можно использовать позже)
        venue: event._embedded?.venues?.[0]?.name || '',
        url: event.url || '#',
        image: event.images?.[0]?.url || '',
      };
    });
}

// Дополнительные утилиты
export function formatDate(dateString) {
  if (!dateString) return 'Дата не указана';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Неверная дата';

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return 'Дата не указана';
  }
}

export function truncateText(text, maxLength = 150) {
  if (!text || typeof text !== 'string') return '';
  return text.length > maxLength
    ? text.substring(0, maxLength).trim() + '...'
    : text;
}
