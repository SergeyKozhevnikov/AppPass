'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import RequestFilter from './RequestFilter';
import Loader from './Loader';
import { fetchPasses, deletePass, Pass } from '@/services/passService';

type RequestListProps = {
  status?: '1' | '2' | '3' | '4';
};

type ApprovalStatus = {
  id: number;
  name: string;
  description: string;
  color: string;
};

const approvalStatuses: ApprovalStatus[] = [
  { id: 1, name: 'Ожидается', description: 'Ожидается согласование', color: '#FFA726' },
  { id: 2, name: 'На согласовании', description: 'Заявка находится на согласовании', color: '#42A5F5' },
  { id: 3, name: 'Согласован', description: 'Заявка согласована', color: '#66BB6A' },
  { id: 4, name: 'Отклонен', description: 'Заявка отклонена', color: '#EF5350' },
];

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

  const handleFilterChange = useCallback((newFilters: { date: string; search: string }) => {
    setFilters(newFilters);
  }, []);

  const filteredRequests = useMemo(() => {
    // Приводим status из пропсов к числу для сравнения
    const statusId = status ? Number(status) : null;

    return requests.filter((req) => {
      const matchesStatus = statusId ? req.status_id === statusId : true;
      const matchesDate = filters.date
        ? new Date(req.date_created) <= new Date(filters.date + 'T23:59:59')
        : true;
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

  const renderStatusChip = (statusId: number) => {
    const status = approvalStatuses.find((s) => s.id === statusId);
    if (!status) return null;

    return (
      <Chip
        label={status.name}
        title={status.description}
        style={{ backgroundColor: status.color, color: 'white' }}
        size="small"
      />
    );
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
                    <TableCell>ФИО заявителя</TableCell>
                    <TableCell>Телефон заявителя</TableCell>
                    <TableCell>Email заявителя</TableCell>
                    <TableCell>Авто</TableCell>
                    <TableCell>Статус заявки</TableCell>
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
                      <TableCell>{req.phone}</TableCell>
                      <TableCell>{req.email}</TableCell>
                      <TableCell>
                        {req.hasCar === 'Yes' && <DirectionsCarIcon color="primary" />}
                      </TableCell>
                      <TableCell>{renderStatusChip(req.status_id)}</TableCell>
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
            Удалить заявку на пропуск для <br /> <strong>{passToDelete?.fullName}</strong>?
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