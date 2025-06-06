'use client';

// Шаблон поля
import { REGISTER_FIELDS } from '@/lib/constants';
import { Grid, TextField } from '@mui/material';

// объединенный тип из значений объекта + интерфейс для пропсов
type RegisterFieldsValue =
  (typeof REGISTER_FIELDS)[keyof typeof REGISTER_FIELDS];
interface FieldProps {
  field: RegisterFieldsValue;
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

export function RegisterUserField({
  field,
  currentUrl,
  errors,
  register,
}: FieldProps) {
  // необязательные и закрытые для изменения поля
  const optionalFields =
    field === REGISTER_FIELDS.pos ||
    field === REGISTER_FIELDS.phoneNum ||
    field === REGISTER_FIELDS.department;

  // изменение падежа для фамилии и почты
  const getPlaceholder = (field: RegisterFieldsValue): string => {
    switch (field.labelRu) {
      case 'Фамилия':
        return 'фамилию';
      case 'Почта':
        return 'почту';
      default:
        return field.labelRu.toLowerCase();
    }
  };

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
