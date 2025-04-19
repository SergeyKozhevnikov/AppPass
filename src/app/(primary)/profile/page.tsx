// Страница редактирования пользователя (Сергей П)
'use client';

import { scrollbarStyles } from '@/styles/shared-styles';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Container,
  Avatar,
  Grid,
} from '@mui/material';

export default function Profile() {
  function handleSubmit(): void {
    console.log('submit');
  }

  const profileFields = {
    avatar: '#',
    tabNum: 'Табельный номер',
    surename: 'Фамилия',
    name: 'Имя',
    change123123: 'Отчество',
    pos: 'Должность',
    depatment: 'Подразделение',
    email: 'Почта',
    password: 'Пароль', // name, type, fieldType= disable, required, обычное
  };

  // можно вынести в отдельный компонент в этой же папке
  function fieldTemplate(fieldName: string) {
    function getPlaceholder() {
      if (fieldName === profileFields.surename) return 'фамилию';
      if (fieldName === profileFields.email) return 'почту';
      return fieldName.toLowerCase();
    }

    return (
      <Grid size={8}>
        <Typography variant="caption" color="initial">
          {fieldName}
        </Typography>
        <TextField
          placeholder={`Введите ${getPlaceholder()}`}
          fullWidth
          required
          autoFocus
          sx={{
            mt: 0.7,
            bgcolor: '#F9F9F9',
            '& fieldset': { border: 'none' },
            borderRadius: '8px',
          }}
        />
      </Grid>
    );
  }

  return (
    <Container
      className="profile"
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
        <Avatar src="#" sx={{ height: '55px', width: '55px', mr: 2 }}></Avatar>{' '}
        {/* user.avatar */}
        <Box>
          <Typography component="h1" color="initial" fontSize={18}>
            {'user.name' + ' ' + 'user.surename'}
          </Typography>
          <Typography component="h2" color="initial" fontSize={14}>
            {'user.role'}
          </Typography>
        </Box>
      </Box>
      <Grid
        component="form"
        onSubmit={handleSubmit}
        gridAutoColumns={2}
        container
        spacing={3}
        columns={16}
      >
        {fieldTemplate('Табельный номер')}
        {fieldTemplate('Фамилия')}
        {fieldTemplate('Имя')}
        {fieldTemplate('Отчество')}
        {fieldTemplate('Должность')}
        {fieldTemplate('Номер отдела')}
        {fieldTemplate('Логин')}
        {fieldTemplate('Почта')}
        {fieldTemplate('Пароль')}
        {fieldTemplate('Телефон')}
      </Grid>
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
    </Container>
  );
}
