// Интерфейсы пользователя
// Приставка I вначале означает Interface

export type TRole = 'Пользователь' | 'Администратор';

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
  phoneNum?: string;
}

// Остальные свойства (т.е. все свойства пользователя)
export interface IUser extends IUserProfile {
  id: number;
  role: TRole;
  createdAt: string; // или Date?
  updatedAt?: string;
}
