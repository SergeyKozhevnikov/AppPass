// src/app/(primary)/support/FilterForm.tsx
'use client';

import * as React from 'react';
import { TextField, Button, Box } from '@mui/material';

interface Filters {
  fullName?: string;
  problem?: string;
  email?: string;
  phoneNumber?: string;
}

interface FilterFormProps {
  onFilterChange: (filters: Filters) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<Filters>({
    fullName: '',
    problem: '',
    email: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onFilterChange(filters);
  };

  return (
    <Box component="form" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        label="ФИО заявителя"
        name="fullName"
        value={filters.fullName}
        onChange={handleChange}
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1, minWidth: '180px' }}
      />
      <TextField
        label="Проблема"
        name="problem"
        value={filters.problem}
        onChange={handleChange}
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1, minWidth: '180px' }}
      />
      <TextField
        label="Почта"
        name="email"
        value={filters.email}
        onChange={handleChange}
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1, minWidth: '180px' }}
      />
      <TextField
        label="Номер телефона"
        name="phoneNumber"
        value={filters.phoneNumber}
        onChange={handleChange}
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1, minWidth: '180px' }}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Применить фильтр
      </Button>
    </Box>
  );
};

export default FilterForm;