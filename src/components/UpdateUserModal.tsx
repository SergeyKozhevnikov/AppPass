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
  FormControl,
  InputLabel,
  NativeSelect,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { UPDATE_FIELDS } from '@/lib/constants';
import { Dispatch, FormEventHandler, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { profileUserFields, profileUserSchema } from '@/interfaces/zod-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { scrollbarStyles } from '@/styles/shared-styles';
import { userApi } from '@/lib/userApi';
import { User } from '@/services/userService';
import UpdateUserField from './UpdateUserField';
import UpdatePasswordModal from './UpdatePasswordModal';

interface IProps {
  isOpen: boolean;
  currentUser: User | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<string>>;
}

export default function UpdateUserModal(props: IProps) {
  const { isOpen, currentUser, setIsOpen, setResult } = props;
  const [isOpenPassChange, setIsOpenPassChange] = useState(false);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<profileUserFields>({
    resolver: zodResolver(profileUserSchema),
    defaultValues: {
      id: currentUser?.id,
      role: currentUser?.role,
      surname: currentUser?.surname,
      name: currentUser?.name,
      patronymic: currentUser?.patronymic,
      pos: currentUser?.pos,
      department: currentUser?.department,
      login: currentUser?.login,
      email: currentUser?.email,
      phoneNum: currentUser?.phoneNum,
    },
    mode: 'onChange', // Валидация при изменении полей
  });

  // Обработчик отправки формы
  const onSubmit: FormEventHandler<HTMLFormElement> = handleSubmit(() => {
    const formData = getValues();
    console.log(formData);
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
          phoneNum: formData.phoneNum ?? '',
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
        maxWidth="md"
        fullWidth
      >
        <Grid
          container
          sx={{ p: 2, alignItems: 'start', justifyContent: 'space-between' }}
        >
          <DialogTitle sx={{ p: 0 }}>Обновление пользователя</DialogTitle>
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
              sx={{ justifyContent: { xs: 'center', sm: 'space-between' } }}
            >
              {/* Поле выбора роли */}
              <Grid size={1} alignContent="center">
                <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Роль
                  </InputLabel>
                  <NativeSelect
                    defaultValue={currentUser?.role ?? 'Пользователь'}
                    {...register('role')}
                    sx={{
                      height: '45px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                    inputProps={{
                      name: 'role',
                      id: 'role',
                    }}
                  >
                    <option value={'Пользователь'}>Пользователь</option>
                    <option value={'Администратор'}>Администратор</option>
                  </NativeSelect>
                </FormControl>
              </Grid>

              {/* Проходим по константе, в которой определены поля профиля, и возвращаем для каждого поля компонент */}
              {Object.values(UPDATE_FIELDS).map((f) => (
                <UpdateUserField
                  field={f}
                  errors={errors[f.label]}
                  register={register}
                  key={f.label}
                ></UpdateUserField>
              ))}

              <DialogActions sx={{ p: 0, width: { xs: '100%', md: 'auto' } }}>
                <Grid
                  size={{ xs: 1, md: 2 }}
                  container
                  spacing={2}
                  justifyContent={{ xs: 'center', sm: 'end' }}
                >
                  <Button
                    color="primary"
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                    onClick={() => setIsOpenPassChange(true)}
                  >
                    Изменить пароль
                  </Button>
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

      <UpdatePasswordModal
        isOpen={isOpenPassChange}
        currentUserId={currentUser?.id}
        setIsOpen={setIsOpenPassChange}
        setResult={setResult}
      ></UpdatePasswordModal>
    </Container>
  );
}
