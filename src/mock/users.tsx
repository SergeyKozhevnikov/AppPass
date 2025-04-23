

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
    tnumber: '2025-04-20',
    lastName: 'Иванов',
    firstName: 'Александр',
    middleName: 'Александрович',
    spiciality: 'Инженер',
    email: '111@mail.ru',
    role: 'Администратор',
  },

];