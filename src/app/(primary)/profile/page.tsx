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
  CircularProgress,
} from '@mui/material';
import { FormEventHandler, useEffect, useState } from 'react';
import { profileUserFields, profileUserSchema } from '@/interfaces/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { userApi } from '@/lib/userApi';
import { ICustomUser } from '@/configs/auth';
import UpdatePasswordModal from '@/components/UpdatePasswordModal';

export default function Profile() {
  const pathname = usePathname(); // текущий url
  const [result, setResult] = useState('');
  const [isOpenErrorAlert, setIsOpenErrorAlert] = useState(false);
  const [isOpenSuccessAlert, setIsOpenSuccessAlert] = useState(false);
  const [updatePasswordDialogOpen, setUpdateUserDialogOpen] = useState(false);
  const { data: session, update } = useSession();
  const user = useSession().data?.user;

  // Уведомления о результате действий
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
      id: user?.id ?? 0,
      tabNum: user?.tabNum ?? 0,
      surname: user?.surname ?? '',
      name: user?.name ?? '',
      patronymic: user?.patronymic ?? '',
      pos: user?.pos ?? '',
      department: user?.department ?? '',
      login: user?.login ?? '',
      email: user?.email ?? '',
      phoneNum: user?.phoneNum ?? '',
      role: user?.role ?? 'Пользователь',
    },
    mode: 'onChange', // Валидация при изменении полей
  });

  useEffect(() => {
    if (user) {
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
    }
  }, [user, setValue]);

  async function updateSession(data: ICustomUser): Promise<void> {
    console.log(data);
    
    await update({
      ...session,
      user: {
        id: data.id,
        role: data.role,
        tabNum: data.tabNum,
        surname: data.surname,
        name: data.name,
        patronymic: data.patronymic,
        login: data.login,
        email: data.email,
        pos: data.pos,
        department: data.department,
        phoneNum: data.phoneNum,
        updatedAt: data.updatedAt,
      },
    });
  }

  // Обработчик отправки формы
  const onSubmit: FormEventHandler<HTMLFormElement> = handleSubmit(() => {
    const { ...formData } = getValues();

    if (formData.id) {
      userApi
        .updateUser(formData.id, {
          role: formData.role,
          surname: formData.surname,
          name: formData.name,
          patronymic: formData.patronymic,
          pos: formData.pos ?? '',
          department: formData.department ?? '',
          login: formData.login,
          email: formData.email,
          password: formData.password,
          phoneNum: formData.phoneNum ?? '',
        })
        .then((res) => {
          console.log(res);
          updateSession(res.data.userData);
          setResult('success');
        })
        .catch(() => {
          setResult('error');
          throw new Error('Что-то пошло не так');
        });
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
      {user ? (
        <>
          <Box display={'flex'} sx={{ mb: 3 }}>
            <Avatar
              src={'#'}
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
            {/* Проходим по полям профиля, и возвращаем для каждого компонент */}
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
              <Button 
                  onClick={() => setUpdateUserDialogOpen(true)}>
                <Link
                  underline="hover"
                  href="#"
                  color="inherit"
                  alignContent={'center'}
                >
                  Изменить пароль
                </Link>
              </Button>
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
        </>
      ) : (
        // Загрузка
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '70vh' }}
        >
          <Grid>
            <CircularProgress size="3rem" />
          </Grid>
        </Grid>
      )}

      {/* Если updatePasswordDialogOpen-true, открыть диалоговое окно и передать ему параметры */}
      {updatePasswordDialogOpen && (
        <UpdatePasswordModal
          currentUserId={user?.id}
          isOpen={updatePasswordDialogOpen}
          setIsOpen={setUpdateUserDialogOpen}
          setResult={setResult}
        />
      )}
    </Container>
  );
}
