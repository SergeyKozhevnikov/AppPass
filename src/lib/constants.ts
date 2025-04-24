// Константы, для удобного изменения их в одном файле

// Например, точки перестроения экрана
export const LAPTOP = '(max-width: 1024px)';
export const TABLET = '(max-width: 768px)';
export const MOBILE = '(max-width: 550px)';

// Константа для авторизации пользователя
export const AUTH_FIELDS = {
  login: { label: 'login', type: 'login' },
  password: { label: 'password', type: 'password' },
} as const;

// Константа для полей создания пользователя
export const REGISTER_FIELDS = {
  surname: { label: 'Фамилия', type: 'text' },
  name: { label: 'Имя', type: 'text' },
  patronymic: { label: 'Отчество', type: 'text' },
  login: { label: 'Логин', type: 'text' },
  email: { label: 'Почта', type: 'email' },
  password: { label: 'Пароль', type: 'password' },
} as const;

// Константа для полей профиля
export const PROFILE_FIELDS = {
  tabNum: { label: 'Табельный номер', type: 'number' },
  surname: { label: 'Фамилия', type: 'text' },
  name: { label: 'Имя', type: 'text' },
  patronymic: { label: 'Отчество', type: 'text' },
  pos: { label: 'Должность', type: 'text' },
  department: { label: 'Подразделение', type: 'text' },
  login: { label: 'Логин', type: 'text' },
  email: { label: 'Почта', type: 'email' },
  password: { label: 'Пароль', type: 'password' },
  phoneNum: { label: 'Телефон', type: 'number' },
} as const;
