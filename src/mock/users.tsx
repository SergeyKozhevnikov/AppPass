

export type UsersRequest = {
  id: number;
  tnumber: string;
  lastName: string;
  firstName: string;
  middleName: string;
  spiciality: string;
  email: string;
  role: string;

};

export const mockUsers: UsersRequest[] = [
  {
    id: 1,
    tnumber: '20907092',
    lastName: 'Иванов',
    firstName: 'Александр',
    middleName: 'Александрович',
    spiciality: 'Инженер',
    email: '111@mail.ru',
    role: 'Администратор',
  },
  {
    id: 2,
    tnumber: '20907091',
    lastName: 'Петров',
    firstName: 'Илья',
    middleName: 'Александрович',
    spiciality: 'Инженер 2к',
    email: '222@mail.ru',
    role: 'Согласующий',
  },
  {
    id: 3,
    tnumber: '34567092',
    lastName: 'Александров',
    firstName: 'Иван',
    middleName: 'Петрович',
    spiciality: 'Старший специалист',
    email: '333@mail.ru',
    role: 'Администратор',
  },
  {
    id: 4,
    tnumber: '20455091',
    lastName: 'Камов',
    firstName: 'Семён',
    middleName: 'Алексеевич',
    spiciality: 'Ведущий Инженер',
    email: '444@mail.ru',
    role: 'Согласующий',
  },
];