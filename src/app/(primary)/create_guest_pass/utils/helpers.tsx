import { z } from "zod"
import { addDays } from "date-fns"

// Схема валидации полей формы с использованием Zod
export const formSchema = z
  .object({
    fullName: z.string().min(5, { message: 'ФИО должно содержать не менее 5 символов!' }),
    phone: z.string().regex(/^\+7[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/, { message: 'Формат: +7(900)000-00-00' }),
    organization: z.string().min(2, { message: 'Организация не указана!' }),
    email: z.string().email({ message: 'Укажите корректный @mail!' }),
    birthDate: z.preprocess(
      (val) => {
        // Если значение null или некорректная дата — возвращаем undefined, чтобы сработал required_error
        if (val === null || isNaN(new Date(val as string).getTime())) {
          return undefined;
        }
        return val;
      },
      z
        .date({
          required_error: 'Дата рождения не верна!', // Показывается, если поле пустое
          invalid_type_error: 'Некорректная дата!', // Показывается, если введён невалидный формат
        })
        .max(new Date(), {
          message: 'Дата рождения не может быть указана будущим числом!', // Проверка на будущую дату
        }),
    ),
    hasCar: z.string(),
    justification: z
      .string()
      .min(50, { message: 'Обоснование должно содержать не менее 50 символов!' })
      .max(500, { message: 'Максимум 500 символов!' }),
    startDate: z.date({ required_error: 'Укажите дату начала' }),
    endDate: z.date({ required_error: 'Укажите дату окончания' }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'Дата окончания должна быть позднее даты начала!',
    path: ['endDate'],
  });

// Дефолтные значения для формы
export const defaultFormValues = {
  fullName: "",
  phone: "",
  organization: "",
  email: "",
  birthDate: new Date("1900-01-01T00:00:00"),
  hasCar: "No",
  justification: "",
  startDate: addDays(new Date(), 1), // По умолчанию завтрашний день
  endDate: addDays(new Date(), 6), // По умолчанию через 6 дней
}

// Функция для создания читаемых названий полей
export const fieldNames: Record<string, string> = {
  fullName: "ФИО",
  phone: "Контактный телефон",
  organization: "Организация",
  email: "Почтовый адрес",
  birthDate: "Дата рождения",
  justification: "Обоснование",
  startDate: "Дата начала",
  endDate: "Дата окончания",
  hasCar: "Наличие автомобиля",
}
