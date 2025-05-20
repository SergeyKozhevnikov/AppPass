"use client";

import React, { useState, useEffect, useMemo } from 'react'; // !!!!!!!!!!!!!!!
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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InventoryIcon from '@mui/icons-material/Inventory';
// import { mockRequests } from '@/mock/requests'; // !!!!!!!!!!!!!!!
import RequestFilter from './RequestFilter';
import { fetchPasses, Pass } from '@/services/passService'; // !!!!!!!!!!!!!!!

type RequestListProps = {
  status?: 'drafts' | 'inReview' | 'approved' | 'rejected';
};

const RequestList: React.FC<RequestListProps> = ({ status }) => {
  const [filters, setFilters] = useState<{ date: string; search: string }>({ date: '', search: '' });
  const [requests, setRequests] = useState<Pass[]>([]); // !!!!!!!!!!!!!!!
  const [loading, setLoading] = useState(true); // !!!!!!!!!!!!!!!

  useEffect(() => {
    fetchPasses() // !!!!!!!!!!!!!!!
      .then(data => {
        setRequests(data); // !!!!!!!!!!!!!!!
        setLoading(false); // !!!!!!!!!!!!!!!
      })
      .catch(err => {
        console.error(err); // !!!!!!!!!!!!!!!
        setLoading(false); // !!!!!!!!!!!!!!!
      });
  }, []); // !!!!!!!!!!!!!!!

  const handleFilterChange = (newFilters: { date: string; search: string }) => {
    setFilters(newFilters);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => { // !!!!!!!!!!!!!!!
      const matchesStatus = status ? req.status === status : true;
      const matchesDate = filters.date ? req.date === filters.date : true;
      const matchesSearch = filters.search
        ? `${req.firstName} ${req.lastName} ${req.middleName}`.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [filters, status, requests]); // !!!!!!!!!!!!!!!

  if (loading) {
    return <div>Загрузка заявок...</div>; // !!!!!!!!!!!!!!!
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
                    <TableCell>Материалы</TableCell>
                    <TableCell align="center" className="w-[15px]"></TableCell>
                    <TableCell align="center" className="w-[15px]"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.createdAt}</TableCell>
                      <TableCell>{req.fullName}</TableCell>
                      <TableCell>
                        {req.hasCar && <DirectionsCarIcon color="primary" />}
                      </TableCell>
                      <TableCell>
                        {req.hasMaterials && <InventoryIcon color="secondary" />}
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
              {filteredRequests.length === 0 && (
                <Box textAlign="center" py={4} color="gray">
                  Ничего не найдено по текущим фильтрам
                </Box>
              )}
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestList;