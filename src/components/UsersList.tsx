
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
import { mockUsers } from '@/mock/users';

const UsersList = () => {
 
  return (
    <div>
     
      <Card sx={{ boxShadow: 'none', border: 'none' }}>
        <CardContent sx={{ boxShadow: 'none', border: 'none', p: 0  }}>
          <Box sx={{ boxShadow: 'none', border: 'none' }} mt={2} className="overflow-x-auto">
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
                  {mockUsers.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.tnumber}</TableCell>
                      <TableCell>{req.lastName}</TableCell>
                      <TableCell>{req.firstName}</TableCell>
                      <TableCell>{req.middleName}</TableCell>
                      <TableCell>{req.spiciality}</TableCell>
                      <TableCell>{req.email}</TableCell>
                      <TableCell><select><option>Администратор</option><option>Согласующий</option><option>Пользователь</option></select></TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" aria-label="редактировать">
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