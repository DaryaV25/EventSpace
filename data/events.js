// Данные о мероприятиях хранятся в массиве в памяти (без базы данных)

let nextId = 7;

const events = [
  {
    id: 1,
    title: 'Встреча спикеров и создателей',
    date: '2026-04-15',
    time: '19:00',
    city: 'Минск',
    address: 'ул. Октябрьская, 16',
    price: 45,
    description:
      'Открытый разговор с авторами проектов: как рождаются идеи и что помогает довести их до результата.',
    image: '/images/event1.png',
  },
  {
    id: 2,
    title: 'Концерт в EventSpace',
    date: '2026-05-10',
    time: '20:00',
    city: 'Гомель',
    address: 'ул. Советская, 8',
    price: 60,
    description:
      'Живой концерт в камерном пространстве: музыка, свет и общение после выступления.',
    image: '/images/event2.png',
  },
  {
    id: 3,
    title: 'Нетворкинг вечер',
    date: '2026-06-05',
    time: '18:30',
    city: 'Москва',
    address: 'ул. Тверская, 12',
    price: 30,
    description:
      'Вечер знакомств для тех, кто ищет единомышленников, партнёров и новые проекты.',
    image: '/images/event3.png',
  },
  {
    id: 4,
    title: 'Мастер-класс по креативному мышлению',
    date: '2026-06-20',
    time: '17:00',
    city: 'Санкт-Петербург',
    address: 'Невский проспект, 45',
    price: 50,
    description:
      'Практическое занятие с упражнениями на генерацию идей и работу в команде.',
    image: '/images/img1.png',
  },
  {
    id: 5,
    title: 'Летний перформанс',
    date: '2026-07-12',
    time: '21:00',
    city: 'Гродно',
    address: 'ул. Советская, 22',
    price: 35,
    description:
      'Театрально-музыкальный перформанс на открытой площадке пространства EventSpace.',
    image: '/images/img2.png',
  },
  {
    id: 6,
    title: 'Августовский концерт',
    date: '2026-08-15',
    time: '20:00',
    city: 'Минск',
    address: 'ул. Долгобродская, 16',
    price: 55,
    description:
      'Завершение летнего сезона: концерт, диджей-сет и нетворкинг до позднего вечера.',
    image: '/images/img3.png',
  },
];

function getAll() {
  return events;
}

function getById(id) {
  return events.find((event) => event.id === Number(id));
}

function add(data) {
  const event = {
    id: nextId++,
    title: data.title,
    date: data.date,
    time: data.time,
    city: data.city,
    address: data.address,
    price: Number(data.price) || 0,
    description: data.description,
    image: data.image || '/images/first.png',
  };

  events.push(event);
  return event;
}

module.exports = { getAll, getById, add };
