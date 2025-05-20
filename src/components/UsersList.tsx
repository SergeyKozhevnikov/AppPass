'use client'; // определяет компонент как клиентский

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
//import EditUser from './EditUser';

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
//import { mockUsers } from '@/mock/users';
import { fetchUsers, User } from '@/services/userService';
//import { mockUsers } from '@/mock/users';

//interface IProps {
//  setResult: Dispatch<SetStateAction<string>>;
//}

type UsersListProps = {
  
};

const UsersList: React.FC<UsersListProps> = ({ }) => {
//const UsersList = (props: IProps) => {
//  const { setResult } = props;

  // Начало блока для бэка
  const [requests, setRequests] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
      fetchUsers() 
        .then(data => {
          setRequests(data); 
          setLoading(false); 
          console.log(data);
        })
        .catch(err => {
          console.error(err); 
          setLoading(false); 
        });
    }, []);

 const userRequests = useMemo(() => {
    return requests.filter((req) => { // !!!!!!!!!!!!!!!
      const matchesStatus = status ? req.status === status : true;
   

      
    });
  }, [requests]); // !!!!!!!!!!!!!!!

  if (loading) {
    return <div>Загрузка пользователей...</div>; // !!!!!!!!!!!!!!!
  }
  // Обработчик
  //const handleEdit = () => {
  //const [isOpen, setIsOpen] = useState(false);

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
                    <TableCell>Роли</TableCell>
                    <TableCell className="w-[15px]" align="center"></TableCell>
                    <TableCell className="w-[15px]" align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.role}</TableCell>
                      <TableCell>{req.tabNum}</TableCell>
                      <TableCell>{req.surname}</TableCell>
                      <TableCell>{req.name}</TableCell>
                      <TableCell>{req.email}</TableCell>
                      <TableCell>{req.login}</TableCell>
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
