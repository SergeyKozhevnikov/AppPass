'use client';

import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Pass, updatePass } from '@/services/passService';
import { useSession } from 'next-auth/react';

type EditPassFormProps = {
  open: boolean;
  onClose: () => void;
  initialData: Pass | null;
  onUpdate: (updated: Pass) => void;
};

const statusOptions = [
  { id: 1, label: 'Ожидается' },
  { id: 2, label: 'На согласовании' },
  { id: 3, label: 'Согласован' },
  { id: 4, label: 'Отклонен' },
];

const passTypeOptions = [
  { id: 1, label: 'Гостевой' },
  { id: 2, label: 'Временный' },
  { id: 3, label: 'Постоянный' },
];

const EditPassForm: React.FC<EditPassFormProps> = ({
                                                     open,
                                                     onClose,
                                                     initialData,
                                                     onUpdate,
                                                   }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'Администратор';

  const [formData, setFormData] = useState<Pass | null>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
          ...prev,
          [name]: name === 'pass_type' || name === 'status_id' ? Number(value) : value,
        }
        : prev
    );
  };

  const handleSubmit = async () => {
    if (!formData?.id) return;
    try {
      const updated = await updatePass(formData.id, formData);
      onUpdate(updated);
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении заявки:', error);
    }
  };

  if (!formData) return null;

  const fieldStyle = { marginBottom: 16 };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Редактировать заявку</DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          label="Тип пропуска"
          name="pass_type"
          value={formData.pass_type || ''}
          onChange={handleChange}
          fullWidth
          required
          style={fieldStyle}
        >
          {passTypeOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="ФИО"
          name="fullName"
          value={formData.fullName || ''}
          onChange={handleChange}
          fullWidth
          required
          style={fieldStyle}
        />

        <TextField
          label="Телефон"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          fullWidth
          style={fieldStyle}
        />

        <TextField
          label="Организация"
          name="organization"
          value={formData.organization || ''}
          onChange={handleChange}
          fullWidth
          style={fieldStyle}
        />

        <TextField
          label="Email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          type="email"
          fullWidth
          style={fieldStyle}
        />

        <TextField
          label="Дата рождения"
          name="birthDate"
          type="date"
          value={formData.birthDate ? formData.birthDate.slice(0, 10) : ''}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          style={fieldStyle}
        />

        <TextField
          select
          label="Наличие авто"
          name="hasCar"
          value={formData.hasCar || ''}
          onChange={handleChange}
          fullWidth
          style={fieldStyle}
        >
          <MenuItem value="Yes">Да</MenuItem>
          <MenuItem value="No">Нет</MenuItem>
        </TextField>

        <TextField
          label="Обоснование"
          name="justification"
          value={formData.justification || ''}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          style={fieldStyle}
        />

        <TextField
          label="Дата начала действия"
          name="startDate"
          type="date"
          value={formData.startDate ? formData.startDate.slice(0, 10) : ''}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          style={fieldStyle}
        />

        <TextField
          label="Дата окончания действия"
          name="endDate"
          type="date"
          value={formData.endDate ? formData.endDate.slice(0, 10) : ''}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          style={fieldStyle}
        />

        {isAdmin && (
          <TextField
            select
            label="Статус"
            name="status_id"
            value={formData.status_id || ''}
            onChange={handleChange}
            fullWidth
            style={fieldStyle}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Отмена
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPassForm;