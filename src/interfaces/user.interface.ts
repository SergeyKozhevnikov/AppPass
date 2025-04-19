// Интерфейсы пользователя
// Приставка I вначале означает Interface

// Для регистрации пользователя
export interface IRegisteredUser {
  surname: string;
  name: string;
  patronymic: string;
  login: string;
  email: string;
  password: string;
}

// Для редактирования профиля
export interface IUserProfile extends IRegisteredUser {
  tabNum: number;
  pos?: string;
  department?: string;
  phoneNumber?: number;
}

// Остальные свойства (т.е. все свойства пользователя)
export interface IUser extends IUserProfile {
  id: number;
  role: 'user' | 'admin';
}

// Константа для отображаемых названий полей профиля
export const PROFILE_FIELDS = {
  tabNum: 'Табельный номер',
  surname: 'Фамилия',
  name: 'Имя',
  patronymic: 'Отчество',
  pos: 'Должность',
  department: 'Подразделение',
  login: 'Логин',
  email: 'Почта',
  password: 'Пароль',
  phoneNum: 'Телефон',
} as const;

export type TProfileFieldName = keyof typeof PROFILE_FIELDS; // тип значений PROFILE_FIELDS
