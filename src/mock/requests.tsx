// src/mock/requests.ts

export type Request = {
  id: number;
  date: string;
  lastName: string;
  firstName: string;
  middleName: string;
  hasCar: boolean;
  hasMaterials: boolean;
};

const firstNames = [
  'Александр', 'Дмитрий', 'Иван', 'Сергей', 'Михаил', 'Андрей', 'Евгений', 'Павел', 'Виктор', 'Николай',
];

const lastNames = [
  'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Соколов', 'Лебедев', 'Козлов', 'Новиков',
];

const middleNames = [
  'Александрович', 'Дмитриевич', 'Иванович', 'Сергеевич', 'Михайлович', 'Андреевич', 'Евгеньевич', 'Павлович', 'Викторович', 'Николаевич',
];

export const mockRequests: Request[] = Array.from({ length: 40 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[i % lastNames.length];
  const middle = middleNames[i % middleNames.length];

  return {
    id: i + 1,
    date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
    firstName: first,
    lastName: last,
    middleName: middle,
    hasCar: i % 2 === 0,
    hasMaterials: i % 3 === 0,
  };
});