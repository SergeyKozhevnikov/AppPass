// import Cookies from 'js-cookie'; // библиотека для работы с cookie

// Класс взаимодействия с данными пользователя
class UserApi {
  #url;
  #headers;

  constructor(data) {
    this.#url = data.url; // ссылка на сервер
    this.#headers = {
      ...data.headers,
      // authorization: `Bearer ${Cookies.get('auth_token')}`,
    };
  }

  // Проверка статуса запроса
  #handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  // Загрузка информации о пользователе по логину
  getUserByLogin(data) {
    return fetch(`${this.#url}/users/login/${data.login}`, {
      method: 'POST',
      headers: this.#headers,
      // credentials: 'include',
      body: JSON.stringify(data), // {login, password}
    }).then(this.#handleResponse);
  }

  // Загрузка информации о пользователе
  getUser(id) {
    // по умолчанию метод get
    return fetch(`${this.#url}/users/${id}`, {
      headers: this.#headers,
      // credentials: 'include', // теперь куки посылаются вместе с запросом
    }).then(this.#handleResponse);
  }

  // Возвращает всех пользователей
  getUsers() {
    return fetch(`${this.#url}/users`, {
      headers: this.#headers,
      // credentials: 'include',
    }).then(this.#handleResponse);
  }

  // Редактирование профиля
  updateUser(
    id,
    {
      role,
      surname,
      name,
      patronymic,
      pos,
      department,
      login,
      email,
      password,
      phoneNum,
    }
  ) {
    return fetch(`${this.#url}/users/${id}`, {
      method: 'PATCH',
      headers: this.#headers,
      // credentials: 'include',
      body: JSON.stringify({
        role: role,
        surname: surname,
        name: name,
        patronymic: patronymic,
        pos: pos,
        department: department,
        login: login,
        email: email,
        password: password,
        phoneNum: phoneNum,
      }),
    }).then(this.#handleResponse);
  }

  // Создание пользователя
  createUser(data) {
    return fetch(`${this.#url}/users`, {
      method: 'POST',
      headers: this.#headers,
      // credentials: 'include',
      body: JSON.stringify(data), //  surname, name, patronymic, login, email, password
    }).then(this.#handleResponse);
  }

  // Удаление пользователя
  deleteUser(id) {
    return fetch(`${this.#url}/users/${id}`, {
      method: 'DELETE',
      // credentials: 'include',
      headers: this.#headers,
    }).then(this.#handleResponse);
  }
}

export default UserApi;

// Класс UserApi, отвечающий за запросы к серверу
export const userApi = new UserApi({
  url: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
