// Константы, для удобного изменения их в одном файле

// Например, точки перестроения экрана
export const LAPTOP = '(max-width: 1024px)';
export const TABLET = '(max-width: 768px)';
export const MOBILE = '(max-width: 550px)';

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
