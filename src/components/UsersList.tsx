'use client'; // определяет компонент как клиентский

import { useEffect, useState } from 'react';

import React from 'react';
import {
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchUsers, deleteUser, User } from '@/services/userService';
// import { Pass, deletePass } from '@/services/passService';
import Loader from './Loader';

interface IProps {
  result: string;
  // setResult: Dispatch<React.SetStateAction<string>>;
}

const UsersList = (props: IProps) => {
  const { result } = props;
  // Начало блока для бэка
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
    const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    //const [userToName] = useState<User | null>(null);

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


    const handleDeleteUserClick = (user: User) => {
      setUserToDelete(user);
      setDeleteUserDialogOpen(true);
      console.log(user);
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
  

  
    if (loading) {
      return <Loader />;
    }
  // Обработчик
  // const handleEdit = () => {}

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
                          aria-label="редактировать"
                          //onClick={() => setIsOpen(true)}
                        >
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
    </div>
  );
};

export default UsersList;
