// Шаблон поля
import { PROFILE_FIELDS } from '@/lib/constants';
import { Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';

// объединенный тип из значений объекта + интерфейс для пропсов
type ProfileFieldValue = (typeof PROFILE_FIELDS)[keyof typeof PROFILE_FIELDS];
interface FieldProps {
  field: ProfileFieldValue;
  currentUrl?: string;
}

// Стили поля
const getFieldStyles = (isDisabled: boolean) => ({
  bgcolor: isDisabled ? '#D9D9D9' : '#F9F9F9',
  borderRadius: '8px',
  '& fieldset': { border: 'none' },
  mt: 0.7,
  // цвет текста для disabled полей
  '.MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#000',
  },
});

export default function Field({ field, currentUrl }: FieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  // необязательные и закрытые для изменения поля
  const optionalFields =
    field === PROFILE_FIELDS.pos ||
    field === PROFILE_FIELDS.phoneNum ||
    field === PROFILE_FIELDS.department;
  const profileDisableFields =
    currentUrl === '/profile' &&
    (field === PROFILE_FIELDS.tabNum ||
      field === PROFILE_FIELDS.login ||
      field === PROFILE_FIELDS.email);

  // изменение падежа для фамилии и почты
  const getPlaceholder = (field: ProfileFieldValue): string => {
    switch (field.label) {
      case 'Фамилия':
        return 'фамилию';
      case 'Почта':
        return 'почту';
      default:
        return field.label.toLowerCase();
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Grid container size={1}>
      <Typography variant="caption" color="initial">
        {field.label}
      </Typography>
      <TextField
        placeholder={`Введите ${getPlaceholder(field)}`}
        fullWidth
        type={field.type}
        required={!optionalFields}
        disabled={profileDisableFields}
        autoFocus={currentUrl !== '/profile'}
        sx={getFieldStyles(profileDisableFields)}
      />
    </Grid>
  );
}
