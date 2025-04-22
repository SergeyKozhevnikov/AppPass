// src/mock/requests.ts

export type Request = {
  id: number;
  date: string;
  lastName: string;
  firstName: string;
  middleName: string;
  hasCar: boolean;
  hasMaterials: boolean;
  status: 'drafts' | 'inReview' | 'approved' | 'rejected';
};

export const mockRequests: Request[] = [
  {
    id: 1,
    date: '2025-04-20',
    lastName: 'Иванов',
    firstName: 'Александр',
    middleName: 'Александрович',
    hasCar: true,
    hasMaterials: false,
    status: 'drafts',
  },
  {
    id: 2,
    date: '2025-04-19',
    lastName: 'Петров',
    firstName: 'Дмитрий',
    middleName: 'Дмитриевич',
    hasCar: false,
    hasMaterials: true,
    status: 'inReview',
  },
  {
    id: 3,
    date: '2025-04-18',
    lastName: 'Сидоров',
    firstName: 'Михаил',
    middleName: 'Александрович',
    hasCar: true,
    hasMaterials: true,
    status: 'approved',
  },
  {
    id: 4,
    date: '2025-04-17',
    lastName: 'Кузнецов',
    firstName: 'Иван',
    middleName: 'Иванович',
    hasCar: false,
    hasMaterials: false,
    status: 'rejected',
  },
  {
    id: 5,
    date: '2025-04-16',
    lastName: 'Смирнов',
    firstName: 'Никита',
    middleName: 'Петрович',
    hasCar: true,
    hasMaterials: false,
    status: 'approved',
  },
  {
    id: 6,
    date: '2025-04-15',
    lastName: 'Фёдоров',
    firstName: 'Андрей',
    middleName: 'Владимирович',
    hasCar: false,
    hasMaterials: true,
    status: 'drafts',
  },
  {
    id: 7,
    date: '2025-04-14',
    lastName: 'Васильев',
    firstName: 'Павел',
    middleName: 'Сергеевич',
    hasCar: true,
    hasMaterials: true,
    status: 'inReview',
  },
  {
    id: 8,
    date: '2025-04-13',
    lastName: 'Морозов',
    firstName: 'Егор',
    middleName: 'Аркадьевич',
    hasCar: false,
    hasMaterials: false,
    status: 'rejected',
  },
  {
    id: 9,
    date: '2025-04-12',
    lastName: 'Зайцев',
    firstName: 'Илья',
    middleName: 'Игоревич',
    hasCar: true,
    hasMaterials: true,
    status: 'approved',
  },
  {
    id: 10,
    date: '2025-04-11',
    lastName: 'Козлов',
    firstName: 'Максим',
    middleName: 'Олегович',
    hasCar: false,
    hasMaterials: false,
    status: 'inReview',
  },
];