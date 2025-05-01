// Страница авторизации пользователя (Сергей П)
'use client';

import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  ImageListItem,
  Grid,
  Alert,
} from '@mui/material';
import './login.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useState } from 'react';
import { signIn } from 'next-auth/react';
import { AUTH_FIELDS } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authFields, authSchema } from '../../../interfaces/zod-types';

export default function LoginPage() {
  // Alert исчезает, когда если вводишь новые данные (onChangeCapture)
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const router = useRouter();

  // деструкторизация
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<authFields>({
    resolver: zodResolver(authSchema), // zodResolver интегрирует zod схему в форму
    defaultValues: {
      login: '',
      password: '',
    },
    mode: 'onChange', // Валидация при изменении полей
  });

  // Обработчик отправки формы
  const onSubmit: FormEventHandler<HTMLFormElement> = handleSubmit(async () => {
    const formData = getValues();

    const res = await signIn('credentials', {
      login: formData.login,
      password: formData.password,
      redirect: false, // чтобы в случае ошибки не перебрасывало на встроенную форму nextauth
    });

    // есть ответ и нет ошибки
    if (res && !res.error) {
      router.push('/');
    } else {
      setIsOpenAlert(true);
      console.log(res);
    }
  });

  // стиль для полей
  const fieldStyle = {
    mb: 2,
    '& fieldset': { border: 'none' },
    '& .MuiInputBase-root .MuiInputBase-input': {
      bgcolor: '#F9F9F9',
      borderRadius: '8px',
    },
    // для ошибки
    '& .MuiFormHelperText-root.Mui-error': {
      m: 0,
      pt: 1,
      pl: 2,
      bgcolor: '#E5E5E5',
    },
  };

  return (
    <main>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container columns={{ sm: 1, md: 2 }}>
          <Grid
            size={{ sm: 1 }}
            sx={{
              height: '100vh',
              alignContent: 'center',
              justifyContent: 'center',
              bgcolor: '#E5E5E5',
              flexGrow: 1,
            }}
          >
            {/* Alert сообщение об ошибке авторизации */}
            {isOpenAlert && (
              <Box height={0}>
                <Alert
                  severity="error"
                  sx={{
                    justifyContent: 'center',
                    position: 'relative',
                    maxWidth: '368px',
                    left: 0,
                    right: 0,
                    bottom: { xs: '55px', sm: '45px', md: '70px' },
                    m: 'auto',
                  }}
                >
                  Ошибка. Проверьте введенные данные
                </Alert>
              </Box>
            )}
            <Box
              sx={{
                p: 2,
                m: 'auto',
                maxWidth: '400px',
              }}
            >
              {/* Логотип - для экранов менее 900 */}
              <ImageListItem
                sx={{
                  d: 'flex',
                  justifyItems: 'center',
                  mb: '10%',
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {/* eslint-disable-next-line */}
                <img
                  style={{ width: '80%' }}
                  src="/assets/svg/textLogoBlue.svg"
                  alt={'Логотип'}
                />
              </ImageListItem>
              <Typography component="h1" variant="h5" sx={{ mb: 5 }}>
                Вход в систему
              </Typography>

              {/* Поля ввода */}
              <Box component="form" onSubmit={onSubmit} noValidate>
                <Typography variant="caption" color="initial">
                  Логин
                </Typography>
                <TextField
                  placeholder="Введите логин"
                  fullWidth
                  autoFocus
                  type={AUTH_FIELDS.login.type}
                  {...register('login')}
                  error={!!errors.login} // двойное отрицание для преобразование в булевое
                  helperText={errors.login?.message}
                  sx={fieldStyle}
                  onChangeCapture={() => setIsOpenAlert(false)}
                />
                <Typography variant="caption" color="initial">
                  Пароль
                </Typography>
                <TextField
                  placeholder="Введите пароль"
                  fullWidth
                  type={AUTH_FIELDS.password.type}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={fieldStyle}
                  onChangeCapture={() => setIsOpenAlert(false)}
                />

                {/* Чекбокс и Забыли пароль */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#ADA7A7',
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Запомнить меня"
                  />
                  <Link underline="hover" href="#" color="inherit">
                    Забыли пароль?
                  </Link>
                </Box>

                {/* Кнопка войти */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 5 }}
                >
                  Войти
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Логотип - для экранов более 900 */}
          <Grid
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}
            className="login-intro"
            size={{ sm: 1 }}
          >
            <Box justifyItems={'center'} sx={{ mt: '15%', mb: '15%' }}>
              <ImageListItem>
                <Image
                  height={400}
                  width={400}
                  src="/assets/svg/textLogo.svg"
                  alt={'Логотип'}
                />
              </ImageListItem>
              <Typography
                component="h3"
                variant="h5"
                color="white"
                sx={{
                  maxWidth: { xs: '200px', sm: '320px', md: '400px' },
                  fontSize: { xs: '0.8rem', sm: '1.25rem', md: '1.5rem' },
                }}
              >
                Система оформления пропусков
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
