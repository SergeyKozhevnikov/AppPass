export type User = {
  id: number;
  //date: string;
  //createdAt: string;
  //fullName: string,
  //lastName: string;
  //firstName: string;
  //middleName: string;
  //hasCar: boolean;
  //hasMaterials: boolean;


  role: string;
  tabNum: number;
  surname: string;
  name: string;
  patronymic: string;
  pos: string;
  department: string;
  login: string;
  email: string;
  password: string;
  phoneNum: string;
  status: 'drafts' | 'inReview' | 'approved' | 'rejected'; // Добавлено свойство status
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('http://195.133.147.112:3001/api/users');
  if (!response.ok) {
    throw new Error('Ошибка при получении пользователей');
  }
  const data = await response.json();
  return data.data; // Возвращаем только массив из поля data
};
