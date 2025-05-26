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
  status: 'drafts' | 'inReview' | 'approved' | 'rejected';
};

// Получение всех пропусков
export const fetchPasses = async (): Promise<Pass[]> => {
  const response = await fetch(`${BACKEND_ADDRESS}/passes`);
  if (!response.ok) {
    throw new Error('Ошибка при получении заявок');
  }
  const data = await response.json();
  return data.data;
};

// Удаление пропуска по ID
export const deletePass = async (id: number): Promise<void> => {
  const response = await fetch(`${BACKEND_ADDRESS}/passes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Ошибка при удалении пропуска');
  }
};