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
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { REGISTER_FIELDS } from '@/lib/constants';
import Field from '@/components/Field';
import { Dispatch, FormEventHandler, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { newUserFields, newUserSchema } from '@/interfaces/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { scrollbarStyles } from '@/styles/shared-styles';
import { userApi } from '@/lib/userApi';

// Пароль по умолчанию = его логин. и почта = логин@greenatom.ru
// При создании пользователя сначала запрос в БД нет ли такого же логина (а соответсвенно и почты), если есть, информировать в поле, исправить вручную
// а также смотрим последний табельный и прибавляем к нему +1
interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<string>>;
}

export default function RegisterModal(props: IProps) {
  const { isOpen, setIsOpen, setResult } = props;

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<newUserFields>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      surname: '',
      name: '',
      patronymic: '',
      login: '',
      email: '', // @atom.ru
      password: '',
    },
    mode: 'onChange', // Валидация при изменении полей
  });

  // Обработчик отправки формы
  const onSubmit: FormEventHandler<HTMLFormElement> = handleSubmit(() => {
    const formData = getValues();
    console.log(formData);
    userApi.createUser(formData).then((res) => setResult('success') ) //console.log(res) ) // res.user)
          .catch(() => {
            setResult('error');
            throw new Error('что то пошло не так');
          });
    
    setIsOpen(false);
  });

  return (
    <Container component="section">
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{ p: 2, maxHeight: '80%', margin: 'auto' }}
        maxWidth="md"
        fullWidth
      >
        <Grid
          container
          sx={{ p: 2, alignItems: 'start', justifyContent: 'space-between' }}
        >
          <DialogTitle sx={{ p: 0 }}>Создание пользователя</DialogTitle>
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
            maxWidth: '1200px',
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
              columns={{ xs: 1, md: 2 }}
              sx={{ justifyContent: { xs: 'center', sm: 'end' } }}
            >
              {/* Проходим по константе, в которой определены поля профиля, и возвращаем для каждого поля компонент */}
              {Object.values(REGISTER_FIELDS).map((f) => (
                <Field
                  field={f}
                  errors={errors[f.label]}
                  register={register}
                  key={f.label}
                ></Field>
              ))}

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
                    Отправить
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
