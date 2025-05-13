// Страница редактирования пользователя (Сергей П)
'use client';

import Field from '@/components/Field';
import { usePathname } from 'next/navigation';
import { PROFILE_FIELDS } from '@/lib/constants';
import { alertStyle, scrollbarStyles } from '@/styles/shared-styles';
import {
  Box,
  Typography,
  Button,
  Link,
  Container,
  Avatar,
  Grid,
  Alert,
} from '@mui/material';
import { FormEventHandler, useEffect, useState } from 'react';
import { profileUserFields, profileUserSchema } from '@/interfaces/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

export default function Profile() {
  // Текущий путь url
  const pathname = usePathname();
  const [result, setResult] = useState('');
  const [isOpenErrorAlert, setIsOpenErrorAlert] = useState(false);
  const [isOpenSuccessAlert, setIsOpenSuccessAlert] = useState(false);
  const user = useSession().data?.user;
  console.log(user);

  // Если успешно и, если ошибка
  useEffect(() => {
    if (result === 'success') {
      setIsOpenSuccessAlert(true);
      setTimeout(() => {
        setIsOpenSuccessAlert(false);
        setResult('');
      }, 5000); // исчезает через 7 сек
    } else if (result === 'error') {
      setIsOpenErrorAlert(true);
      setTimeout(() => {
        setResult('');
      }, 5000);
    }
  }, [result]);

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<profileUserFields>({
    resolver: zodResolver(profileUserSchema),
    defaultValues: {
      tabNum: 0,
      surname: '',
      name: '',
      patronymic: '',
      pos: '',
      department: '',
      login: 'login',
      email: `login@atom.ru`,
      phoneNum: '',
      role: 'Пользователь',
    },
    mode: 'onChange', // Валидация при изменении полей
  });

  useEffect(() => {
    setValue('tabNum', user!.tabNum);
    setValue('surname', user!.surname);
    setValue('name', user!.name);
    setValue('patronymic', user!.patronymic);
    if (user!.pos) {
      setValue('pos', user!.pos);
    }
    if (user!.department) {
      setValue('department', user!.department);
    }
    setValue('login', user!.login);
    setValue('email', user!.email);
    if (user!.phoneNum) {
      setValue('phoneNum', user!.phoneNum);
    }
  }, [user]);

  // Обработчик отправки формы
  const onSubmit: FormEventHandler<HTMLFormElement> = handleSubmit(() => {
    const { ...formData } = getValues();

    // Здесь можно добавить логику отправки данных на сервер
    if (formData) {
      setResult('success');
    } else {
      setResult('error');
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
      {/* Сообщения об успехе и ошибке */}
      {isOpenSuccessAlert && (
        <Alert
          severity="success"
          sx={{
            ...alertStyle,
            top: '20%',
            bottom: '',
          }}
        >
          Данные пользователя изменены
        </Alert>
      )}
      {isOpenErrorAlert && (
        <Alert
          severity="error"
          sx={{
            ...alertStyle,
            top: '20%',
            bottom: '',
          }}
        >
          Ошибка. Проверьте введенные данные
        </Alert>
      )}

      {/* Основное содержимое */}
      <Box display={'flex'} sx={{ mb: 3 }}>
        <Avatar
          src={'...'}
          sx={{ height: '55px', width: '55px', mr: 2 }}
        ></Avatar>
        <Box>
          <Typography component="h1" color="initial" fontSize={18}>
            {`${user?.name} ${user?.surname}`}
          </Typography>
          <Typography component="h2" color="initial" fontSize={14}>
            {`${user?.role}`}
          </Typography>
        </Box>
      </Box>
      <Grid
        component="form"
        onSubmit={onSubmit}
        container
        spacing={3}
        columns={{ xs: 1, md: 2 }}
        sx={{ justifyContent: { xs: 'center', md: 'end' } }}
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
        <Grid
          container
          size={2}
          sx={{
            display: 'flex',
            color: '#007EC0',
            justifyContent: { xs: 'center', md: 'end' },
          }}
        >
          <Link
            underline="hover"
            href="#"
            color="inherit"
            alignContent={'center'}
          >
            Изменить пароль
          </Link>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ width: { xs: '100%', md: '220px' } }}
          >
            Применить
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
