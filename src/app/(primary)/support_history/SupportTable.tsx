// src/app/(primary)/support/SupportTable.tsx
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface SupportTicket {
  id: number;
  fullName: string;
  problem: string;
  email: string;
  phoneNumber: string;
  status: string;
}

interface SupportTableProps {
  tickets: SupportTicket[];
}

const SupportTable: React.FC<SupportTableProps> = ({ tickets }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#007bff', color: 'white' }}>
            <TableCell sx={{ color: 'white' }}>ФИО</TableCell>
            <TableCell align="left" sx={{ color: 'white' }}>Проблема</TableCell>
            <TableCell align="left" sx={{ color: 'white' }}>Номер телефона</TableCell>
            <TableCell align="left" sx={{ color: 'white' }}>Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} sx={{ '&:not(:last-of-type)': { borderBottom: '1px solid #ddd' } }}>
              <TableCell component="th" scope="row">
                {ticket.fullName}
              </TableCell>
              <TableCell align="left">{ticket.problem}</TableCell>
              <TableCell align="left">{ticket.phoneNumber}</TableCell>
              <TableCell align="left">{ticket.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SupportTable;