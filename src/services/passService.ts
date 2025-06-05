import { BACKEND_ADDRESS } from '@/lib/constants';

export type Pass = {
  id: number;
  date: string;
  date_created: string;
  fullName: string;
  birthDate?: string;
  lastName: string;
  justification: string;
  firstName: string;
  organization: string;
  email: string;
  status_id: number;
  startDate?: string;
  endDate?: string;
  phone: string;
  middleName: string;
  hasCar: string;
  hasMaterials: boolean;
  pass_type: string;
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

// Обновление пропуска по ID
export const updatePass = async (id: number, data: Pass): Promise<Pass> => {
  const response = await fetch(`${BACKEND_ADDRESS}/passes/${id}`, {
    method: 'PUT', // или PATCH — в зависимости от API
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Ошибка при обновлении заявки');
  }

  const updatedData = await response.json();
  return updatedData.data; // или updatedData, если API возвращает иначе
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