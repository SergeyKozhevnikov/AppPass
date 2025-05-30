'use client'; // определяет компонент как клиентский

import { useEffect, useState } from 'react';

import React from 'react';
import {
  Grid,
  Container,
  Box,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
  DialogActions,
  Button,
  Chip,
  DialogTitle,
  
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchUsers, deleteUser, editUser, User } from '@/services/userService';
import { Dispatch, FormEventHandler, SetStateAction } from 'react';
import Loader from './Loader';
import { PROFILE_FIELDS } from '@/lib/constants';
import { Close } from '@mui/icons-material';
//import { register } from 'module';
import Field from './Field';


interface IProps {
  isOpen: boolean;
  setResult: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
interface IProps {
  result: string;
  // setResult: Dispatch<React.SetStateAction<string>>;
}

const UsersList = (props: IProps) => {
  const { result, isOpen, setIsOpen, setResult } = props;
  
  // Начало блока для бэка
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
    const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
    const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

  useEffect(() => {
    if (result === '' || result === 'success') {
      fetchUsers()
        .then((data) => {
          setRequests(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [result]);

  // const userRequests = useMemo(() => {
  //   return requests.filter((req) => {
  //     const matchesStatus = status ? req.status === status : true;
  //   });
  // }, [requests]);

  if (loading) {
    return <div>Загрузка пользователей...</div>;
  }

  // Функция удаления пользователя
    const handleDeleteUserClick = (user: User) => {
      setUserToDelete(user);
      setDeleteUserDialogOpen(true);
      
    };
  
    const confirmDelete = async () => {
      if (!userToDelete) return;
      try {
        await deleteUser(userToDelete.id);
        setRequests(prev => prev.filter(p => p.id !== userToDelete.id));
      } catch (error) {
        console.error('Ошибка при удалении пропуска:', error);
      } finally {
        setDeleteUserDialogOpen(false);
        setUserToDelete(null);
      }
    };
  
    const cancelDelete = () => {
      setDeleteUserDialogOpen(false);
      setUserToDelete(null);
    };
    // Функция редактирования профиля пользователя
    const handleEditUserClick = (user: User) => {
      setUserToEdit(user);
      setEditUserDialogOpen(true);
    };
    
    const confirmEdit  = async () => {
      if (!userToEdit) return;
      try {
        await editUser(userToEdit.id);
        setRequests(prev => prev.filter(p => p.id !== userToEdit.id));
      } catch (error) {
        console.error('Ошибка при редактировании данных пользователя:', error);
      } finally {
        setEditUserDialogOpen(false);
        setUserToEdit(null);
      }
    };
    const cancelEdit = () => {
      setEditUserDialogOpen(false);
      setUserToEdit(null);
    };
  
    if (loading) {
      return <Loader />;
    }
  // Обработчик

  return (
    <div>
      <Card sx={{ boxShadow: 'none', border: 'none' }}>
        <CardContent sx={{ boxShadow: 'none', border: 'none', p: 0 }}>
          <Box
            sx={{ boxShadow: 'none', border: 'none' }}
            mt={2}
            className="overflow-x-auto"
          >
            <Paper sx={{ boxShadow: 'none', border: 'none' }}>
              <Table>
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell>Таб.Номер</TableCell>
                    <TableCell>Фамилия</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Отчество</TableCell>
                    <TableCell>Должность</TableCell>
                    <TableCell>Почта</TableCell>
                    <TableCell>Роль</TableCell>
                    <TableCell className="w-[15px]" align="center"></TableCell>
                    <TableCell className="w-[15px]" align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.tabNum}</TableCell>
                      <TableCell>{req.surname}</TableCell>
                      <TableCell>{req.name}</TableCell>
                      <TableCell>{req.patronymic}</TableCell>
                      <TableCell>{req.pos}</TableCell>
                      <TableCell>{req.email}</TableCell>
                      <TableCell>{req.role}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          aria-label="редактировать"  onClick={() => handleEditUserClick(req)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="error" aria-label="удалить" onClick={() => handleDeleteUserClick(req)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </CardContent>
      </Card>
<Dialog
        open={deleteUserDialogOpen}
        onClose={cancelDelete}
        PaperProps={{
          sx: {
            width: 500,
            height: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 2,
          },
        }}
      >
        <DialogContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">
            Вы уверены что хотите удалить пользователя <br /> <strong>{userToDelete?.surname} {userToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={cancelDelete} variant="outlined">
            Отмена
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Container component="section">
              <Dialog
                open={editUserDialogOpen}
                //open={isOpen}
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
                        onClick={() => setEditUserDialogOpen(false)}
                        sx={{ height: 22, width: 22 }}
                      />
                    </IconButton>
                  </DialogActions>

                  <Table>
                <TableHead className="bg-gray-100">
                  <TableRow>
                  <TableCell>Таб.Номер</TableCell>
                    <TableCell>Фамилия</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Отчество</TableCell>
                    <TableCell>Должность</TableCell>
                    <TableCell>Почта</TableCell>
                    <TableCell>Роль</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                      <TableCell>{userToEdit?.tabNum}</TableCell>
                      <TableCell>{userToEdit?.surname}</TableCell>
                      <TableCell>{userToEdit?.name}</TableCell>
                      <TableCell>{userToEdit?.patronymic}</TableCell>
                      <TableCell>{userToEdit?.pos}</TableCell>
                      <TableCell>{userToEdit?.email}</TableCell>
                      <TableCell>{userToEdit?.role}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
                </Grid>
                <DialogContent>
                  <Grid
                    component="form"
                    container
                    spacing={3}
                    columns={2}
                    sx={{ justifyContent: 'flex-end' }}
                  >
                    {/* Проходим по константе, в которой определены поля профиля, и возвращаем для каждого поля компонент */}
                    
        
                    <DialogActions sx={{ p: 0 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setEditUserDialogOpen(false)}>
                      
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

    </div>
  );

   // Обработчик отправки формы


    // Здесь можно добавить логику отправки данных на сервер

};

export default UsersList;
