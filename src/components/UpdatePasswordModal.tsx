// Страница создания нового пользователя (Сергей П)
'use client';

import {
  Grid,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Dispatch, FormEventHandler, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { passwordUserFields, passwordUserSchema } from '@/interfaces/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { scrollbarStyles } from '@/styles/shared-styles';
import { userApi } from '@/lib/userApi';

interface IProps {
  isOpen: boolean;
  currentUserId: number | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<string>>;
}

export default function UpdatPasswordModal(props: IProps) {
  const { isOpen, currentUserId, setIsOpen, setResult } = props;

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<passwordUserFields>({
    resolver: zodResolver(passwordUserSchema),
    defaultValues: {
      password: '',
      passwordRepeat: '',
    },
    mode: 'onChange', // Валидация при изменении полей
  });

  // Обработчик отправки формы
  const onSubmit: FormEventHandler<HTMLFormElement> = handleSubmit(() => {
    const formData = getValues();
    if (currentUserId) {
      userApi
        .updateUser(currentUserId, {
          password: formData.password,
        })
        .then((res) => {
          console.log(res);
          setResult('success');
        })
        .catch(() => {
          setResult('error');
          throw new Error('Что-то пошло не так');
        });

      setIsOpen(false);
    }
  });

  return (
    <Container component="section">
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{ p: 2, maxHeight: '80%', margin: 'auto' }}
        maxWidth="xs"
        fullWidth
      >
        <Grid
          container
          sx={{ p: 2, alignItems: 'start', justifyContent: 'space-between' }}
        >
          <DialogTitle sx={{ p: 0 }}>Изменение пароля</DialogTitle>
          <DialogActions sx={{ p: 0 }}>
            <IconButton
              aria-label="delete"
              sx={{ p: 0.25, border: '1px solid', borderRadius: '8px' }}
            >
              <Close
                onClick={() => setIsOpen(false)}
                sx={{ height: 22, width: 22 }}
              />
            </IconButton>
          </DialogActions>
        </Grid>
        <Container
          component="section"
          disableGutters
          sx={{
            height: '100%',
            maxWidth: '800px',
            minHeight: '100%',
            pt: 1,
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            ...scrollbarStyles,
            // [theme.breakpoints.up('sm')]: {}, - применить стили выше размера экрана sm (600px)
          }}
        >
          <DialogContent>
            <Grid
              component="form"
              onSubmit={onSubmit}
              noValidate
              container
              spacing={3}
              columns={1}
              sx={{ justifyContent: { xs: 'center', sm: 'end' } }}
            >
              {/* Проходим по константе, в которой определены поля профиля, и возвращаем для каждого поля компонент */}
              <Grid container size={1}>
                <TextField
                  label={'Новый пароль'}
                  placeholder={'Введите новый пароль'}
                  fullWidth
                  margin="normal"
                  type="password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors['password']?.message}
                  required
                  autoFocus={true}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label={'Повторите новый пароль'}
                  placeholder={'Повторите новый пароль'}
                  fullWidth
                  margin="normal"
                  type="password"
                  {...register('passwordRepeat')}
                  error={!!errors.passwordRepeat || !!errors.root}
                  helperText={errors['passwordRepeat']?.message}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <DialogActions sx={{ p: 0, width: { xs: '100%', sm: 'auto' } }}>
                <Grid
                  size={{ xs: 1, md: 2 }}
                  container
                  spacing={2}
                  justifyContent={{ xs: 'center', md: 'space-between' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                    onClick={() => setIsOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    Изменить
                  </Button>
                </Grid>
              </DialogActions>
            </Grid>
          </DialogContent>
        </Container>
      </Dialog>
    </Container>
  );
}
