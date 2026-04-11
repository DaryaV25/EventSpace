// js/api/apiService.js
import { API_CONFIG } from './config.js';

export async function fetchEventsFromAPI() {
  if (!API_CONFIG.USE_REAL_API) {
    console.log(
      'Реальный Ticketmaster API отключён. Используем только локальные данные.',
    );
    return { _embedded: { events: [] } };
  }

  try {
    let url = `${API_CONFIG.BASE_URL}/events.json?apikey=${API_CONFIG.API_KEY}&countryCode=${API_CONFIG.DEFAULT_COUNTRY}&size=${API_CONFIG.SIZE}&sort=date,asc`;

    if (API_CONFIG.DEFAULT_CITY) {
      url += `&city=${encodeURIComponent(API_CONFIG.DEFAULT_CITY)}`;
    }

    console.log(`GET запрос к Ticketmaster API`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          '401 Unauthorized — API ключ неверный или не активирован',
        );
      }
      throw new Error(`HTTP ошибка: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `Получено событий из API: ${data._embedded?.events?.length || 0}`,
    );
    return data;
  } catch (error) {
    console.error('Ошибка при запросе к Ticketmaster API:', error.message);
    throw error;
  }
}
