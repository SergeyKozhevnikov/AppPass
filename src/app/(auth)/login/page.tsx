// Страница авторизации пользователя (Сергей П)
'use client';

import {
  Box,
  Container,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  ImageListItem,
} from '@mui/material';
import './login.css';
import Image from 'next/image';
import { FormEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AUTH_FIELDS } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();

  // обработка отправки
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const res = await signIn('credentials', {
      login: formData.get('login'),
      password: formData.get('password'),
      redirect: false, // чтобы в случае ошибки не перебрасывало на встроенную форму nextauth
    });

    // есть ответ и нет ошибки
    if (res && !res.error) {
      router.push('/');
    } else {
      console.log(res);
    }
  };

  return (
    <main>
      <section className="login">
        <Container
          sx={{
            d: 'flex',
            height: '100vh',
            alignContent: 'center',
            justifyContent: 'center',
            bgcolor: '#E5E5E5',
          }}
        >
          <Box
            sx={{
              p: 2,
              m: 'auto',
              maxWidth: '400px',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 5 }}>
              Вход в систему
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="caption" color="initial">
                Логин
              </Typography>
              <TextField
                placeholder="Введите логин"
                fullWidth
                name={AUTH_FIELDS.login.label}
                type={AUTH_FIELDS.login.type}
                required
                autoFocus
                sx={{
                  mt: 0.5,
                  mb: 2,
                  bgcolor: '#F9F9F9',
                  '& fieldset': { border: 'none' },
                  borderRadius: '8px',
                }}
              />
              <Typography variant="caption" color="initial">
                Пароль
              </Typography>
              <TextField
                placeholder="Введите пароль"
                fullWidth
                required
                name={AUTH_FIELDS.password.label}
                type={AUTH_FIELDS.password.type}
                sx={{
                  mt: 0.5,
                  mb: 1,
                  bgcolor: '#F9F9F9',
                  '& fieldset': { border: 'none' },
                  borderRadius: '8px',
                }}
              />
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
        </Container>
        <Container className="login-intro">
          <Box justifyItems={'center'} sx={{ mt: '20%' }}>
            <ImageListItem>
              <Image
                height={450}
                width={450}
                src="/assets/svg/textLogo.svg"
                alt={'Логотип'}
              />
            </ImageListItem>
            <Typography component="h3" variant="h5" color="white" width={450}>
              Система оформления пропусков
            </Typography>
          </Box>
        </Container>
      </section>
    </main>
  );
}
