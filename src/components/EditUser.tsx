// Страница редактирования пользователя (Федор Г)
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
import { Dispatch, SetStateAction } from 'react';

// - Логин подставляется автоматически пользователя (если время много не займет)
// - Пароль по умолчанию = его логин. и почта = логин@greenatom.ru
// При создании пользователя сначала запрос в БД нет ли такого же логина (а соответсвенно и почты), если есть, информировать в поле, исправить вручную
// а также смотрим последний табельный и прибавляем к нему +1
interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditUser(props: IProps) {
  const { isOpen, setIsOpen } = props;
  function handleSubmit(evt: { preventDefault: () => void }): void {
    evt.preventDefault();
    setIsOpen(false);
    alert('Пользователь создан (тест)');
  }

  return (
    <Container component="section">
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{ p: 2 }}
        maxWidth="md"
        fullWidth
      >
        <Grid
          container
          sx={{ p: 2, alignItems: 'start', justifyContent: 'space-between' }}
        >
          <DialogTitle sx={{ p: 0, mb: 2 }}>Редактирование данных пользователя</DialogTitle>
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
        <DialogContent>
          <Grid
            component="form"
            onSubmit={handleSubmit}
            container
            spacing={3}
            columns={2}
            sx={{ justifyContent: 'flex-end' }}
          >
            {/* Проходим по константе, в которой определены поля профиля, и возвращаем для каждого поля компонент */}
            {Object.values(REGISTER_FIELDS).map((f) => (
              <Field field={f} key={f.label}></Field>
            ))}

            <DialogActions sx={{ p: 0 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsOpen(false)}
              >
                Отмена
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Отправить
              </Button>
            </DialogActions>
          </Grid>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
