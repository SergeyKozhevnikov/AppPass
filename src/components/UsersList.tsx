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
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchUsers, User } from '@/services/userService';

interface IProps {
  result: string;
  // setResult: Dispatch<React.SetStateAction<string>>;
}

const UsersList = (props: IProps) => {
  const { result } = props;
  // Начало блока для бэка
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
                        <IconButton color="error" aria-label="удалить">
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
    </div>
  );
};

export default UsersList;
