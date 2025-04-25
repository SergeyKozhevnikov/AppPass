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
      alert(`Ошибка ${res?.error}. Проверьте введенные данные`);
      console.log(res);
    }
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
            <Box
              sx={{
                p: 2,
                m: 'auto',
                maxWidth: '400px',
              }}
            >
              {/* Логотип для экранов менее 900 */}
              <ImageListItem
                sx={{
                  d: 'flex',
                  justifyItems: 'center',
                  mb: '10%',
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <Image
                  height={320}
                  width={320}
                  src="/assets/svg/textLogoBlue.svg"
                  alt={'Логотип'}
                />
              </ImageListItem>
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
          </Grid>

          {/* Логотип для экранов более 900 */}
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
