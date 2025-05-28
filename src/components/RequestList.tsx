'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react'; // добавлен useCallback
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
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import RequestFilter from './RequestFilter';
import Loader from './Loader';
import { fetchPasses, deletePass, Pass } from '@/services/passService';

type RequestListProps = {
  status?: 'drafts' | 'inReview' | 'approved' | 'rejected';
};

const RequestList: React.FC<RequestListProps> = ({ status }) => {
  const [filters, setFilters] = useState<{ date: string; search: string }>({ date: '', search: '' });
  const [requests, setRequests] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passToDelete, setPassToDelete] = useState<Pass | null>(null);

  useEffect(() => {
    fetchPasses()
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // !!!!! Изменено: useCallback для стабилизации функции и предотвращения бесконечного рендера
  const handleFilterChange = useCallback((newFilters: { date: string; search: string }) => {
    setFilters(newFilters);
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesStatus = status ? req.status === status : true;

      // Фильтрация по дате
      const matchesDate = filters.date
        ? new Date(req.date_created) <= new Date(filters.date + 'T23:59:59')
        : true;

      // Фильтрация по полному имени
      const matchesSearch = filters.search
        ? req.fullName.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [filters, status, requests]);

  const handleDeleteClick = (pass: Pass) => {
    setPassToDelete(pass);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!passToDelete) return;

    try {
      await deletePass(passToDelete.id);
      setRequests(prev => prev.filter(p => p.id !== passToDelete.id));
    } catch (error) {
      console.error('Ошибка при удалении пропуска:', error);
    } finally {
      setDeleteDialogOpen(false);
      setPassToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setPassToDelete(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <RequestFilter onFilterChange={handleFilterChange} />
      <Card sx={{ boxShadow: 'none', border: 'none' }}>
        <CardContent sx={{ boxShadow: 'none', border: 'none', p: 0 }}>
          <Box mt={2} className="overflow-x-auto">
            <Paper sx={{ boxShadow: 'none', border: 'none' }}>
              <Table>
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>ФИО</TableCell>
                    <TableCell>Авто</TableCell>
                    <TableCell align="center" className="w-[15px]"></TableCell>
                    <TableCell align="center" className="w-[15px]"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        {new Date(req.date_created).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{req.fullName}</TableCell>
                      <TableCell>
                        {req.hasCar === 'Yes' && <DirectionsCarIcon color="primary" />}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" aria-label="редактировать">
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="error" aria-label="удалить" onClick={() => handleDeleteClick(req)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredRequests.length === 0 && (
                <Box textAlign="center" py={4} color="gray">
                  Ничего не найдено по текущим фильтрам
                </Box>
              )}
            </Paper>
          </Box>
        </CardContent>
      </Card>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
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
            Удалить заявку на пропуск для <br/> <strong>{passToDelete?.fullName}</strong>?
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

export default RequestList;