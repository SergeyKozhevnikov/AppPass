import { BACKEND_ADDRESS } from '@/lib/constants';

export type Pass = {
  id: number;
  date: string;
  date_created: string;
  fullName: string;
  lastName: string;
  firstName: string;
  middleName: string;
  hasCar: string;
  hasMaterials: boolean;
  status: 'drafts' | 'inReview' | 'approved' | 'rejected'; // Добавлено свойство status
};

export const fetchPasses = async (): Promise<Pass[]> => {
  const response = await fetch(`${BACKEND_ADDRESS}/passes`);
  if (!response.ok) {
    throw new Error('Ошибка при получении заявок');
  }
  const data = await response.json();
  return data.data; // Возвращаем только массив из поля data
};
