// src/components/RequestFilter.tsx

import React from 'react';
import {
  Box,
  Button,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const RequestFilter: React.FC = () => {
  return (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
      <TextField
        type="date"
        defaultValue="2025-03-01"
        InputLabelProps={{ shrink: true }}
        size="small"
      />
      <Button variant="contained" color="primary">
        Фильтр
      </Button>
      <TextField
        placeholder="Поиск"
        size="small"
        sx={{ minWidth: 250 }}
      />
      <Button variant="contained" color="primary">
        Найти
      </Button>
      <Box flexGrow={1} />
      <Button variant="contained" color="primary" startIcon={<AddIcon />}>
        Создать
      </Button>
    </Box>
  );
};

export default RequestFilter;