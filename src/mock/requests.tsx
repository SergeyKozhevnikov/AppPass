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
    status: 'drafts', // Черновик
  },
  {
    id: 2,
    date: '2025-04-19',
    lastName: 'Петров',
    firstName: 'Дмитрий',
    middleName: 'Дмитриевич',
    hasCar: false,
    hasMaterials: true,
    status: 'inReview', // На согласовании
  },
  {
    id: 3,
    date: '2025-04-18',
    lastName: 'Сидоров',
    firstName: 'Михаил',
    middleName: 'Александрович',
    hasCar: true,
    hasMaterials: true,
    status: 'approved', // Согласованный
  },
  {
    id: 4,
    date: '2025-04-17',
    lastName: 'Кузнецов',
    firstName: 'Иван',
    middleName: 'Иванович',
    hasCar: false,
    hasMaterials: false,
    status: 'rejected', // Отклоненный
  },
];