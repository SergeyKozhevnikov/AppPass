export type Pass = {
  id: number;
  date: string;
  createdAt: string;
  fullName: string,
  lastName: string;
  firstName: string;
  middleName: string;
  hasCar: boolean;
  hasMaterials: boolean;
  status: 'drafts' | 'inReview' | 'approved' | 'rejected'; // Добавлено свойство status
};

export const fetchPasses = async (): Promise<Pass[]> => {
  const response = await fetch('http://localhost:3001/api/passes');
  if (!response.ok) {
    throw new Error('Ошибка при получении заявок');
  }
  const data = await response.json();
  return data.data; // Возвращаем только массив из поля data
};
