import Cookies from 'js-cookie'; // зависимость для взаимодействия с cookie
export const BASE_URL = 'http://localhost:3001';

// Проверка статуса запроса
function handleResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

// Принимает логин и пароль, отправляет запрос авторизации на /login . В ответ сервер вернет jwt, который нужно сохранить в Cookie
export const login = (login, password) => {
  return fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include', // теперь куки посылаются вместе с запросом
    body: JSON.stringify({ login, password }),
  })
    .then(handleResponse)
    .then((data) => {
      if (data.token) {
        Cookies.set('jwt', data.token, { expires: 7 });
      }
      return data;
    });
};

// • функция checkToken - принимает jwt, отправляет запрос на /users/me и возвращает данные пользователя
export const checkToken = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then(handleResponse)
    .then((data) => {
      return data;
    });
};

// Принимает jwt, отправляет запрос на /logout и удаляет JWT из куков пользователя при выходе
export const logout = () => {
  return fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then(handleResponse)
    .then((data) => {
      if (data.token) {
        Cookies.set('jwt', data.token, { expires: 7 });
      }
      return data;
    });
};
