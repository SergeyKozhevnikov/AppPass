// src/app/(primary)/support/supportData.ts
import { SupportTicket } from './types';

export const supportTickets: SupportTicket[] = [
  {
    id: 1,
    fullName: 'Иванов Иван Иванович',
    problem: 'Не грузится сайт',
    email: 'ivanov@example.com',
    phoneNumber: '+79101232367',
    status: 'Отклонена',
  },
  {
    id: 2,
    fullName: 'Сергеев Сергей Сергеевич',
    problem: 'Пропуск не печатается',
    email: 'sergeev@example.com',
    phoneNumber: '+79101232367',
    status: 'Решено',
  },
  {
    id: 3,
    fullName: 'Игорев Игорь Игоревич',
    problem: 'Вылезает непонятная 502 ошибка',
    email: 'igorov@example.com',
    phoneNumber: '+79101232367',
    status: 'В процессе',
  },
];