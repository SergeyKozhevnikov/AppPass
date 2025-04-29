// Страница редактирования пользователя (Сергей П)
'use client';

import Field from '@/components/Field';
import { usePathname } from 'next/navigation';
import { PROFILE_FIELDS } from '@/lib/constants';
import { scrollbarStyles } from '@/styles/shared-styles';
import {
  Box,
  Typography,
  Button,
  Link,
  Container,
  Avatar,
  Grid,
} from '@mui/material';
import { FormEventHandler, useState } from 'react';
import { profileUserFields, profileUserSchema } from '@/interfaces/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function Profile() {
  // Текущий путь url
  const pathname = usePathname();
  // Пример состояния пользователя
  const [user, setUser] = useState({
    tabNum: '0001',
    surname: 'Фамилия',
    name: 'Имя',
    patronymic: 'Отчество',
    pos: 'Инженер',
    department: 'Отдел 3',
    login: 'iofamiliya',
    email: 'iofamiliya@atom.ru',
    password: 'iofamiliya',
    phoneNum: '3-33-33',
    role: 'Пользователь',
  });

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<profileUserFields>({
    resolver: zodResolver(profileUserSchema),
    defaultValues: {
      tabNum: '0001',
      surname: '',
      name: '',
      patronymic: '',
      pos: '',
      department: '',
      login: 'login',
      email: `login@atom.ru`,
      password: '',
      phoneNum: '',
      role: 'Пользователь',
    },
    mode: 'onChange', // Валидация при изменении полей
  });

  // Обработчик отправки формы
  const onSubmit: FormEventHandler<HTMLFormElement> = handleSubmit(() => {
    const { ...formData } = getValues();
    setUser(formData);

    // Здесь можно добавить логику отправки данных на сервер
    if (formData) {
      alert('Данные пользователя успешно изменены');
    } else {
      alert(`Что-то пошло не так. Проверьте введенные данные`);
    }
  });

  return (
    <Container
      component="section"
      sx={{
        height: '100%',
        maxWidth: '1200px',
        minHeight: '100%',
        pt: 3,
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        ...scrollbarStyles,
      }}
    >
      <Box display={'flex'} sx={{ mb: 3 }}>
        <Avatar
          src={'...'}
          sx={{ height: '55px', width: '55px', mr: 2 }}
        ></Avatar>
        <Box>
          <Typography component="h1" color="initial" fontSize={18}>
            {`${user.name} ${user.surname}`}
          </Typography>
          <Typography component="h2" color="initial" fontSize={14}>
            {`${user.role}`}
          </Typography>
        </Box>
      </Box>
      <Grid
        component="form"
        onSubmit={onSubmit}
        container
        spacing={3}
        columns={2}
      >
        {/* Проходим по константе, в которой определены поля профиля, и возвращаем для каждого поля компонент */}
        {Object.values(PROFILE_FIELDS).map((f) => (
          <Field
            field={f}
            currentUrl={pathname}
            errors={errors[f.label]}
            register={register}
            key={f.label}
          ></Field>
        ))}
        <Container
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#007EC0',
            mt: 2.5,
            mb: 3,
          }}
        >
          <Link underline="hover" href="#" color="inherit">
            Изменить пароль
          </Link>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ width: '250px' }}
          >
            Применить
          </Button>
        </Container>
      </Grid>
    </Container>
  );
}
