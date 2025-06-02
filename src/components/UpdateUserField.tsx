// Шаблон поля
import { UPDATE_FIELDS } from '@/lib/constants';
import { Grid, TextField } from '@mui/material';
// import { useState } from 'react';

// объединенный тип из значений объекта + интерфейс для пропсов
type ProfileFieldValue = (typeof UPDATE_FIELDS)[keyof typeof UPDATE_FIELDS];
interface FieldProps {
  field: ProfileFieldValue;
  currentUrl?: string;
  errors: any; // eslint-disable-line
  register: any; // eslint-disable-line
}

// Стиль для disabled полей
const getFieldStyles = {
  '.MuiInputLabel-root.Mui-disabled': {
    color: '#000',
  },
  '.MuiInputBase-input.Mui-disabled ': {
    bgcolor: '#D9D9D9',
    WebkitTextFillColor: '#000',
  },
};

export default function UpdateUserField({
  field,
  currentUrl,
  errors,
  register,
}: FieldProps) {
  // const [showPassword, setShowPassword] = useState(false);
  // необязательные и закрытые для изменения поля
  const optionalFields =
    field === UPDATE_FIELDS.pos ||
    field === UPDATE_FIELDS.phoneNum ||
    field === UPDATE_FIELDS.department;

  // изменение падежа для фамилии и почты
  const getPlaceholder = (field: ProfileFieldValue): string => {
    switch (field.labelRu) {
      case 'Фамилия':
        return 'фамилию';
      case 'Почта':
        return 'почту';
      default:
        return field.labelRu.toLowerCase();
    }
  };

  // const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Grid container size={1}>
      <TextField
        label={field.labelRu}
        placeholder={`Введите ${getPlaceholder(field)}`}
        fullWidth
        margin="normal"
        type={field.type}
        {...register(field.label)}
        error={!!errors}
        helperText={errors?.message}
        required={!optionalFields}
        autoFocus={currentUrl !== '/profile'}
        sx={getFieldStyles}
        InputLabelProps={{ shrink: true }}
      />
    </Grid>
  );
}
