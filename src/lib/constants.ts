// Константы, для удобного изменения их в одном файле
// MUI точки перестроения экрана - https://mui.com/material-ui/customization/breakpoints/

// Константа для авторизации пользователя
export const AUTH_FIELDS = {
  login: { label: 'login', type: 'text' },
  password: { label: 'password', type: 'password' },
} as const;

// Константа для полей создания пользователя
export const REGISTER_FIELDS = {
  surname: { label: 'surname', labelRu: 'Фамилия', type: 'text' },
  name: { label: 'name', labelRu: 'Имя', type: 'text' },
  patronymic: { label: 'patronymic', labelRu: 'Отчество', type: 'text' },
  login: { label: 'login', labelRu: 'Логин', type: 'text' },
  email: { label: 'email', labelRu: 'Почта', type: 'email' },
  password: { label: 'password', labelRu: 'Пароль', type: 'password' },
} as const;

// Константа для полей профиля (без roles, т.к. это не поле)
export const PROFILE_FIELDS = {
  tabNum: { label: 'tabNum', labelRu: 'Табельный номер', type: 'number' },
  surname: { label: 'surname', labelRu: 'Фамилия', type: 'text' },
  name: { label: 'name', labelRu: 'Имя', type: 'text' },
  patronymic: { label: 'patronymic', labelRu: 'Отчество', type: 'text' },
  pos: { label: 'pos', labelRu: 'Должность', type: 'text' },
  department: { label: 'department', labelRu: 'Подразделение', type: 'text' },
  login: { label: 'login', labelRu: 'Логин', type: 'text' },
  email: { label: 'email', labelRu: 'Почта', type: 'email' },
  password: { label: 'password', labelRu: 'Пароль', type: 'password' },
  phoneNum: { label: 'phoneNum', labelRu: 'Телефон', type: 'text' },
} as const;

// Константа для полей обновления пользователя
export const UPDATE_FIELDS = {
  role: { label: 'role', labelRu: 'Роль', type: 'text' },
  surname: { label: 'surname', labelRu: 'Фамилия', type: 'text' },
  name: { label: 'name', labelRu: 'Имя', type: 'text' },
  patronymic: { label: 'patronymic', labelRu: 'Отчество', type: 'text' },
  pos: { label: 'pos', labelRu: 'Должность', type: 'text' },
  department: { label: 'department', labelRu: 'Подразделение', type: 'text' },
  login: { label: 'login', labelRu: 'Логин', type: 'text' },
  email: { label: 'email', labelRu: 'Почта', type: 'email' },
  password: { label: 'password', labelRu: 'Пароль', type: 'password' },
  phoneNum: { label: 'phoneNum', labelRu: 'Телефон', type: 'text' },
} as const;

// Адреса обращения к backend
const backendAddresses = {
  local: 'http://localhost:3001/api',
  server: 'http://195.133.147.112:3001/api',
};
export const BACKEND_ADDRESS = backendAddresses.server; // подставляется в запросы, при необходимости можно поменять его в одном месте - здесь
