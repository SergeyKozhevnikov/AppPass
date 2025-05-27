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
import { PROFILE_FIELDS } from '@/lib/constants';
import Field from '@/components/Field';
import { Dispatch, FormEventHandler, SetStateAction } from 'react';
import { profileUserFields, profileUserSchema } from '@/interfaces/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface IProps {
  isOpen: boolean;
  setResult: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditUser(props: IProps) {
  const { isOpen, setIsOpen, setResult } = props;

  const {
    register,
    getValues,
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
      login: '',
      email: ``,
      phoneNum: '',
      role: 'Пользователь',
    },
    mode: 'onChange', // Валидация при изменении полей
  });

  // Обработчик отправки формы
  const onSubmit: FormEventHandler<HTMLFormElement> = handleSubmit(() => {
    const { ...formData } = getValues();

    // Здесь можно добавить логику отправки данных на сервер
    if (formData) {
      setResult('success');
    } else {
      setResult('error');
    }
    setIsOpen(false);
  });

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
            onSubmit={onSubmit}
            container
            spacing={3}
            columns={2}
            sx={{ justifyContent: 'flex-end' }}
          >
            {/* Проходим по константе, в которой определены поля профиля, и возвращаем для каждого поля компонент */}
            {Object.values(PROFILE_FIELDS).map((f) => (
              <Field
                field={f}
                errors={errors[f.label]}
                register={register}
                key={f.label}
              ></Field>
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
