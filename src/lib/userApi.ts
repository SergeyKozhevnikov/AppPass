import { IRegisteredUser, TRole } from '@/interfaces/user.interface';

// Класс взаимодействия с данными пользователя
class UserApi {
  #url;
  #headers;

  constructor(data: { url: string; headers: object }) {
    this.#url = data.url; // ссылка на сервер
    this.#headers = {
      ...data.headers,
    };
  }

  // Проверка статуса запроса
  #handleResponse(res: Response) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  // Загрузка информации о пользователе по логину
  getUserByLogin(data: { login: string; password: string }) {
    return fetch(`${this.#url}/users/login/${data.login}`, {
      method: 'POST',
      headers: this.#headers,
      body: JSON.stringify(data),
    }).then(this.#handleResponse);
  }

  // Загрузка информации о пользователе
  getUser(id: number) {
    // по умолчанию метод get
    return fetch(`${this.#url}/users/${id}`, {
      headers: this.#headers,
    }).then(this.#handleResponse);
  }

  // Возвращает всех пользователей
  getUsers() {
    return fetch(`${this.#url}/users`, {
      headers: this.#headers,
    }).then(this.#handleResponse);
  }

  // Редактирование профиля
  updateUser(
    id: number,
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
    }: {
      role: TRole;
      surname: string;
      name: string;
      patronymic: string;
      pos?: string;
      department?: string;
      login: string;
      email: string;
      password?: string;
      phoneNum?: string;
    }
  ) {
    return fetch(`${this.#url}/users/${id}`, {
      method: 'PATCH',
      headers: this.#headers,
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
  createUser(data: IRegisteredUser) {
    return fetch(`${this.#url}/users`, {
      method: 'POST',
      headers: this.#headers,
      body: JSON.stringify(data), // surname, name, patronymic, login, email, password
    }).then(this.#handleResponse);
  }

  // Удаление пользователя
  deleteUser(id: number) {
    return fetch(`${this.#url}/users/${id}`, {
      method: 'DELETE',
      headers: this.#headers,
    }).then(this.#handleResponse);
  }
}

export default UserApi;

// Класс UserApi, отвечающий за запросы к серверу
export const userApi = new UserApi({
  url: 'http://195.133.147.112:3001/api',
  // url: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
