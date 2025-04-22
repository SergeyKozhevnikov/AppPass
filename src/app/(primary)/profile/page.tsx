// Страница редактирования пользователя (Сергей П)
'use client';

import Field from '@/components/Field';
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
import { useState } from 'react';

export default function Profile() {
  // Пример состояния пользователя
  const [user, setUser] = useState({
    name: 'Сергей',
    surname: 'Петров',
    role: 'Менеджер',
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    console.log('submit', user);
    setUser({ name: 'Алексей', surname: 'Иванов', role: 'Консультант' });
    // Здесь можно добавить логику отправки данных на сервер
  }

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
        onSubmit={handleSubmit}
        container
        spacing={3}
        columns={2}
      >
        {/* Проходим по константе, в которой определены поля профиля, и возвращаем для каждого поля компонент */}
        {Object.values(PROFILE_FIELDS).map((field) => (
          <Field fieldName={field} key={field}></Field>
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
