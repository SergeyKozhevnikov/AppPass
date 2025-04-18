'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
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

  // Получаем тему и проверяем, является ли устройство мобильным
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 3,
          gap: 2,
        }}
      >
        <Box /> {/* Пустой элемент для выравнивания */}
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}
                startIcon={isMobile ? <AddIcon /> : null}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' }, whiteSpace: 'nowrap', px: { xs: 2, sm: 3 } }}>Добавить
          согласующего</Button>
      </Box>

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
        <TableContainer
          component={Paper}
          sx={{
            mb: 4,
            borderRadius: 1,
            width: '100%',
          }}
        >
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell
                  sx={{
                    width: isMobile ? '10%' : '10%',
                    fontWeight: 'bold',
                    color: '#757575',
                    padding: isMobile ? 1 : 2,
                  }}
                >
                  №
                </TableCell>
                <TableCell
                  sx={{
                    width: isMobile ? '40%' : '45%',
                    fontWeight: 'bold',
                    color: '#757575',
                    padding: isMobile ? 1 : 2,
                  }}
                >
                  ФИО
                </TableCell>
                <TableCell
                  sx={{
                    width: isMobile ? '25%' : '30%',
                    fontWeight: 'bold',
                    color: '#757575',
                    padding: isMobile ? 1 : 2,
                  }}
                >
                  ДОЛЖНОСТЬ
                </TableCell>
                <TableCell
                  sx={{
                    width: isMobile ? '25%' : '15%',
                    fontWeight: 'bold',
                    color: '#757575',
                    padding: isMobile ? 1 : 2,
                  }}
                >
                  ДЕЙСТВИЯ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvers.map((approver, index) => (
                <TableRow key={approver.id}>
                  <TableCell
                    sx={{
                      borderBottom: index === approvers.length - 1 ? 0 : undefined,
                      padding: isMobile ? 1 : 2,
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: index === approvers.length - 1 ? 0 : undefined,
                      wordBreak: 'break-word',
                      padding: isMobile ? 1 : 2,
                    }}
                  >
                    {approver.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: index === approvers.length - 1 ? 0 : undefined,
                      wordBreak: 'break-word',
                      padding: isMobile ? 1 : 2,
                    }}
                  >
                    {approver.position}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: index === approvers.length - 1 ? 0 : undefined,
                      padding: isMobile ? 1 : 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: isMobile ? 0 : 1 }}>
                      {/* Кнопка перемещения вверх */}
                      <IconButton
                        size="small"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        color="default"
                        sx={{ padding: isMobile ? 0.5 : 1 }}
                      >
                        <ArrowUpIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                      {/* Кнопка перемещения вниз */}
                      <IconButton
                        size="small"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === approvers.length - 1}
                        color="default"
                        sx={{ padding: isMobile ? 0.5 : 1 }}
                      >
                        <ArrowDownIcon fontSize={isMobile ? 'small' : 'medium'} />
                      </IconButton>
                      {/* Кнопка удаления */}
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteApprover(approver.id)}
                        color="error"
                        sx={{ padding: isMobile ? 0.5 : 1 }}
                      >
                        <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
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
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
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
