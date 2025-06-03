'use client';

import { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type { ApprovalTabProps, User, ApprovalStatus } from '../types';
import { getAllUsers } from '../services/userApi';

// Статусы согласования с цветами
const approvalStatuses: ApprovalStatus[] = [
  { id: 1, name: 'Ожидается', description: 'Ожидается согласование', color: '#FFA726' }, // Оранжевый
  { id: 2, name: 'На согласовании', description: 'Заявка находится на согласовании', color: '#42A5F5' }, // Голубой
  { id: 3, name: 'Согласован', description: 'Заявка согласована', color: '#66BB6A' }, // Зеленый
  { id: 4, name: 'Отклонен', description: 'Заявка отклонена', color: '#EF5350' }, // Красный
];

export default function ApprovalTab({ approvers, setApproversAction, onSubmitForm }: ApprovalTabProps) {
  // Состояние для модального окна
  const [open, setOpen] = useState(false);

  // Получаем тему и проверяем, является ли устройство мобильным
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Состояние для списка пользователей
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Загрузка списка пользователей при открытии модального окна
  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  // Фильтрация пользователей при изменении поискового запроса
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.surname.toLowerCase().includes(query) ||
          user.name.toLowerCase().includes(query) ||
          (user.patronymic && user.patronymic.toLowerCase().includes(query)) ||
          user.login.toLowerCase().includes(query) ||
          user.pos.toLowerCase().includes(query),
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Функция загрузки пользователей
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      } else {
        console.error('Ошибка при загрузке пользователей:', response.error);
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функция добавления согласующего из списка пользователей
  const handleAddApproverFromList = (user: User) => {
    // Проверяем, не добавлен ли уже этот пользователь
    const isAlreadyAdded = approvers.some((approver) => approver.user_id === user.id);

    if (isAlreadyAdded) {
      // Можно показать уведомление о том, что пользователь уже добавлен
      console.warn('Пользователь уже добавлен в список согласующих');
      return;
    }

    const newId = approvers.length > 0 ? Math.max(...approvers.map((a) => a.id)) + 1 : 1;
    const fullName = `${user.surname} ${user.name}${user.patronymic ? ' ' + user.patronymic : ''}`;

    setApproversAction([
      ...approvers,
      {
        id: newId,
        user_id: user.id, // Сохраняем ID пользователя
        name: fullName,
        position: user.pos,
        login: user.login, // Логин для отображения
        status_id: 1, // По умолчанию "Ожидается"
        status: 'Ожидается',
      },
    ]);

    setOpen(false);
  };

  // Функция удаления согласующего
  const handleDeleteApprover = (id: number) => {
    setApproversAction(approvers.filter((approver) => approver.id !== id));
  };

  // Функция перемещения согласующего вверх
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newApprovers = [...approvers];
    const temp = newApprovers[index];
    newApprovers[index] = newApprovers[index - 1];
    newApprovers[index - 1] = temp;
    setApproversAction(newApprovers);
  };

  // Функция перемещения согласующего вниз
  const handleMoveDown = (index: number) => {
    if (index === approvers.length - 1) return;
    const newApprovers = [...approvers];
    const temp = newApprovers[index];
    newApprovers[index] = newApprovers[index + 1];
    newApprovers[index + 1] = temp;
    setApproversAction(newApprovers);
  };

  // Функция для изменения статуса всех согласующих
  const updateAllApproversStatus = (statusId: number) => {
    const newApprovers = approvers.map((approver) => ({
      ...approver,
      status_id: statusId,
      status: approvalStatuses.find((s) => s.id === statusId)?.name || 'Неизвестно',
    }));
    setApproversAction(newApprovers);
  };

  // Обработчик отправки формы
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmitForm = () => {
    // Изменяем статус всех согласующих на "На согласовании" (id=2)
    updateAllApproversStatus(2);

    // Вызываем функцию отправки формы, если она передана
    if (onSubmitForm) {
      onSubmitForm();
    }
  };

  // Получаем цвет статуса согласования
  const getStatusColor = (statusId?: number) => {
    return approvalStatuses.find((s) => s.id === statusId)?.color || '#9E9E9E'; // Серый по умолчанию
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={isMobile ? <AddIcon /> : null}
          sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' }, whiteSpace: 'nowrap', px: { xs: 2, sm: 3 } }}
        >
          Добавить согласующего
        </Button>
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
                    width: isMobile ? '0%' : '20%',
                    fontWeight: 'bold',
                    color: '#757575',
                    padding: isMobile ? 1 : 2,
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                >
                  СТАТУС
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
                      display: { xs: 'none', md: 'table-cell' },
                    }}
                  >
                    <Chip
                      label={approver.status || 'Ожидается'}
                      sx={{
                        backgroundColor: getStatusColor(approver.status_id),
                        color: 'white',
                        fontWeight: 'medium',
                      }}
                      size="small"
                    />
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

      {/* Модальное окно для выбора пользователя */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Выбор согласующего</DialogTitle>
        <DialogContent>
          {/* Поле поиска */}
          <TextField
            autoFocus
            margin="dense"
            id="search"
            label="Поиск пользователя"
            type="text"
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Список пользователей */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ maxHeight: "400px", overflow: "auto" }}>
              {filteredUsers.length === 0 ? (
                <Typography variant="body1" sx={{ p: 2, textAlign: "center" }}>
                  Пользователи не найдены
                </Typography>
              ) : (
                filteredUsers.map((user, index) => {
                  const isAlreadyAdded = approvers.some((approver) => approver.user_id === user.id)

                  return (
                    <Box key={user.id}>
                      <ListItem
                        component="li"
                        disablePadding
                        sx={{
                          "&:hover": {
                            backgroundColor: isAlreadyAdded ? "rgba(255, 0, 0, 0.04)" : "rgba(0, 0, 0, 0.04)",
                          },
                          opacity: isAlreadyAdded ? 0.5 : 1,
                          cursor: isAlreadyAdded ? "not-allowed" : "pointer",
                        }}
                        onClick={() => !isAlreadyAdded && handleAddApproverFromList(user)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" component="span">
                              {user.surname} {user.name} {user.patronymic}
                              {isAlreadyAdded && (
                                <Typography component="span" color="error" sx={{ ml: 1 }}>
                                  (уже добавлен)
                                </Typography>
                              )}
                            </Typography>
                          }
                          secondary={
                            <>
                              {user.pos}
                              <br />
                              Логин: {user.login}
                            </>
                          }
                        />
                      </ListItem>
                      {index < filteredUsers.length - 1 && <Divider variant="inset" component="li" />}
                    </Box>
                  )
                })
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: 2 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
