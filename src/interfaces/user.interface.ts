// Интерфейсы пользователя
// Приставка I вначале означает Interface

// Для регистрации пользователя
export interface IRegisteredUser {
  surname: string;
  forename: string;
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