// Константы, для удобного изменения их в одном файле

// MUI точки перестроения экрана - https://mui.com/material-ui/customization/breakpoints/

// Константа для авторизации пользователя
export const AUTH_FIELDS = {
  login: { label: 'login', type: 'text' },
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
