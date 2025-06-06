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
  Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import RequestFilter from './RequestFilter';
import Loader from './Loader';
import { fetchPasses, deletePass, approvePass, Pass } from '@/services/passService';
import EditPassForm from './EditPassForm';

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
  const [filters, setFilters] = useState({ date: '', search: '' });
  const [requests, setRequests] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passToDelete, setPassToDelete] = useState<Pass | null>(null);
  const [editingPass, setEditingPass] = useState<Pass | null>(null);

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [passToApprove, setPassToApprove] = useState<Pass | null>(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const loadRequests = useCallback(() => {
    setLoading(true);
    fetchPasses()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    setPage(1);
  }, [filters, status]);

  const handleFilterChange = useCallback((newFilters: { date: string; search: string }) => {
    setFilters(newFilters);
  }, []);

  const filteredRequests = useMemo(() => {
    const statusId = status ? Number(status) : null;
    return requests.filter((req) => {
      const matchesStatus = statusId ? req.status_id === statusId : true;
      const matchesDate = filters.date ? new Date(req.date_created) <= new Date(filters.date + 'T23:59:59') : true;
      const matchesSearch = filters.search ? req.fullName.toLowerCase().includes(filters.search.toLowerCase()) : true;
      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [filters, status, requests]);

  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredRequests.slice(start, start + rowsPerPage);
  }, [filteredRequests, page]);

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);

  const handleDeleteClick = (pass: Pass) => {
    setPassToDelete(pass);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!passToDelete) return;
    try {
      await deletePass(passToDelete.id);
      loadRequests();
    } catch (error) {
      console.error('Ошибка при удалении пропуска:', error);
    } finally {
      setDeleteDialogOpen(false);
      setPassToDelete(null);
    }
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

    // approved passes

    const handleApproveClick = (pass: Pass) => {
      setPassToApprove(pass);
      setApproveDialogOpen(true);
    };
  
    const confirmApprove = async () => {
      if (!passToApprove) return;
      try {
        await approvePass(passToApprove.id);
        setRequests(prev => prev.filter(p => p.id !== passToApprove.id));
      } catch (error) {
        console.error('Ошибка при согласовании пропуска:', error);
      } finally {
        setApproveDialogOpen(false);
        setPassToApprove(null);
      }
    };
  
    const cancelApprove = () => {
      setApproveDialogOpen(false);
      setPassToApprove(null);
    };
  
    //end approve passes

  if (loading) return <Loader />;

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
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell onClick={() => handleApproveClick(req)}>
                        {new Date(req.date_created).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell onClick={() => handleApproveClick(req)}>{req.fullName}</TableCell>
                      <TableCell onClick={() => handleApproveClick(req)}>{req.phone}</TableCell>
                      <TableCell onClick={() => handleApproveClick(req)}>{req.email}</TableCell>
                      <TableCell onClick={() => handleApproveClick(req)}>{req.hasCar === 'Yes' && <DirectionsCarIcon color="primary" />}</TableCell>
                      <TableCell onClick={() => handleApproveClick(req)}>{renderStatusChip(req.status_id)}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => setEditingPass(req)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => handleDeleteClick(req)}>
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

              {/* Пагинация показывается только если заявок больше 5 */}
              {filteredRequests.length > rowsPerPage && (
                <Box display="flex" justifyContent="center" p={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </Paper>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogContent>
          <Typography variant="h6">
            Удалить заявку на пропуск для <br /> <strong>{passToDelete?.fullName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Отмена
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {editingPass && (
        <EditPassForm
          open={!!editingPass}
          onClose={() => setEditingPass(null)}
          initialData={editingPass}
          onUpdate={() => {
            loadRequests();
            setEditingPass(null);
          }}
        />
      )}

<Dialog
        open={approveDialogOpen}
        onClose={cancelApprove}
        PaperProps={{
          sx: {
            width: 400,
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
            Заявка на пропуск: <br /> <strong>{passToApprove?.fullName}</strong> желаете согласовать? 
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={cancelApprove} variant="outlined">
            Отклонить
          </Button>
          <Button onClick={confirmApprove} color="success" variant="contained">
            Согласовать
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default RequestList;