// Шаблон поля
import { Grid, TextField, Typography } from '@mui/material';
import { PROFILE_FIELDS } from '@/interfaces/user.interface';

// объединенный тип из значений объекта + интерфейс для пропсов
type ProfileFieldValue = (typeof PROFILE_FIELDS)[keyof typeof PROFILE_FIELDS];
interface FieldProps {
  fieldName: ProfileFieldValue;
}

// Стили поля
const getFieldStyles = (isDisabled: boolean) => ({
  bgcolor: isDisabled ? '#D9D9D9' : '#F9F9F9',
  borderRadius: '8px',
  '& fieldset': { border: 'none' },
  mt: 0.7,
});

export default function Field({ fieldName }: FieldProps) {
  // необязательные и закрытые для изменения поля
  const optionalFields =
    fieldName === PROFILE_FIELDS.pos ||
    fieldName === PROFILE_FIELDS.phoneNum ||
    fieldName === PROFILE_FIELDS.department;
  const disableFields =
    fieldName === PROFILE_FIELDS.tabNum ||
    fieldName === PROFILE_FIELDS.login ||
    fieldName === PROFILE_FIELDS.email;

  // изменение падежа для фамилии и почты
  const getPlaceholder = (field: ProfileFieldValue): string => {
    switch (field) {
      case 'Фамилия':
        return 'фамилию';
      case 'Почта':
        return 'почту';
      default:
        return field.toLowerCase();
    }
  };

  return (
    <Grid container size={1}>
      <Typography variant="caption" color="initial">
        {fieldName}
      </Typography>
      <TextField
        placeholder={`Введите ${getPlaceholder(fieldName)}`}
        fullWidth
        required={!optionalFields}
        disabled={disableFields}
        autoFocus
        sx={getFieldStyles(disableFields)}
      />
    </Grid>
  );
}
