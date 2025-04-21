'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InventoryIcon from '@mui/icons-material/Inventory'; // иконка материалов
import { mockRequests } from '@/mock/requests';

const RequestList: React.FC = () => {
  return (
    <Card sx={{ boxShadow: 'none', border: 'none' }}>
      <CardContent sx={{ boxShadow: 'none', border: 'none' }}>
        <Box sx={{ boxShadow: 'none', border: 'none' }} mt={2}>
          <Paper sx={{ boxShadow: 'none', border: 'none' }}>
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Фамилия</TableCell>
                  <TableCell>Имя</TableCell>
                  <TableCell>Отчество</TableCell>
                  <TableCell>Авто</TableCell>
                  <TableCell>Материалы</TableCell>
                  <TableCell className="w-[15px]" align="center"></TableCell>
                  <TableCell className="w-[15px]" align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.date}</TableCell>
                    <TableCell>{req.lastName}</TableCell>
                    <TableCell>{req.firstName}</TableCell>
                    <TableCell>{req.middleName}</TableCell>
                    <TableCell>
                      {req.hasCar && (
                        <DirectionsCarIcon color="primary" />
                      )}
                    </TableCell>
                    <TableCell>
                      {req.hasMaterials && (
                        <InventoryIcon color="secondary" />
                      )}
                    </TableCell>
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
  );
};

export default RequestList;