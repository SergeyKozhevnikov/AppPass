'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

// Интерфейс для согласующего
export interface Approver {
  id: number;
  name: string;
  position: string;
}

// Интерфейс для согласующих
export interface ApprovalTabProps {
  approvers: Approver[];
  setApprovers: React.Dispatch<React.SetStateAction<Approver[]>>;
}

export default function ApprovalTab({ approvers, setApprovers }: ApprovalTabProps) {
  // Состояние для модального окна
  const [open, setOpen] = useState(false);

  // Состояние для нового согласующего
  const [newApprover, setNewApprover] = useState({ name: '', position: 'Сотрудник' });

  // Функция добавления согласующего
  const handleAddApprover = () => {
    if (newApprover.name.trim() === '') return;

    const newId = approvers.length > 0 ? Math.max(...approvers.map((a) => a.id)) + 1 : 1;
    setApprovers([
      ...approvers,
      {
        id: newId,
        name: newApprover.name,
        position: newApprover.position,
      },
    ]);
    setNewApprover({ name: '', position: 'Сотрудник' });
    setOpen(false);
  };

  // Функция удаления согласующего
  const handleDeleteApprover = (id: number) => {
    setApprovers(approvers.filter((approver) => approver.id !== id));
  };

  // Функция перемещения согласующего вверх
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newApprovers = [...approvers];
    const temp = newApprovers[index];
    newApprovers[index] = newApprovers[index - 1];
    newApprovers[index - 1] = temp;
    setApprovers(newApprovers);
  };

  // Функция перемещения согласующего вниз
  const handleMoveDown = (index: number) => {
    if (index === approvers.length - 1) return;
    const newApprovers = [...approvers];
    const temp = newApprovers[index];
    newApprovers[index] = newApprovers[index + 1];
    newApprovers[index + 1] = temp;
    setApprovers(newApprovers);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
        Очередь согласования
      </Typography>
      {/* Заголовок секции и кнопка добавления */}
      <Grid container size={12} spacing={2} sx={{ mb: 3 }}>
        <Grid size={9} />
        <Grid size={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Добавить согласующего
          </Button>
        </Grid>
      </Grid>

      {/* Проверяем, пуст ли список согласующих */}
      {approvers.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Очередь согласования пуста
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 1 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ width: '10%', fontWeight: 'bold', color: '#757575' }}>№</TableCell>
                <TableCell sx={{ width: '45%', fontWeight: 'bold', color: '#757575' }}>ФИО</TableCell>
                <TableCell sx={{ width: '30%', fontWeight: 'bold', color: '#757575' }}>ДОЛЖНОСТЬ</TableCell>
                <TableCell sx={{ width: '15%', fontWeight: 'bold', color: '#757575' }}>ДЕЙСТВИЯ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvers.map((approver, index) => (
                <TableRow key={approver.id}>
                  <TableCell sx={{ borderBottom: index === approvers.length - 1 ? 0 : undefined }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ borderBottom: index === approvers.length - 1 ? 0 : undefined }}>
                    {approver.name}
                  </TableCell>
                  <TableCell sx={{ borderBottom: index === approvers.length - 1 ? 0 : undefined }}>
                    {approver.position}
                  </TableCell>
                  <TableCell sx={{ borderBottom: index === approvers.length - 1 ? 0 : undefined }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* Кнопка перемещения вверх */}
                      <IconButton
                        size="small"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        color="default"
                      >
                        <ArrowUpIcon fontSize="small" />
                      </IconButton>
                      {/* Кнопка перемещения вниз */}
                      <IconButton
                        size="small"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === approvers.length - 1}
                        color="default"
                      >
                        <ArrowDownIcon fontSize="small" />
                      </IconButton>
                      {/* Кнопка удаления */}
                      <IconButton size="small" onClick={() => handleDeleteApprover(approver.id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Модальное окно для добавления согласующего */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Добавить согласующего</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="ФИО согласующего"
            type="text"
            fullWidth
            variant="outlined"
            value={newApprover.name}
            onChange={(e) => setNewApprover({ ...newApprover, name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="position"
            label="Должность"
            type="text"
            fullWidth
            variant="outlined"
            value={newApprover.position}
            onChange={(e) => setNewApprover({ ...newApprover, position: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: 2 }}>
          <Button onClick={handleAddApprover} variant="contained" color="primary">
            Добавить
          </Button>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
