'use client';

import type React from 'react';
import { useState, useEffect, type SyntheticEvent } from 'react';
import { differenceInDays, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Grid,
  IconButton,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CssBaseline,
  styled,
  Snackbar,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ClearIcon from '@mui/icons-material/Clear';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CalendarIcon } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Импорт компонентов табов и интерфейса согласующих для валидации
import ApprovalTab from './tabs/approval-tab';
import type { Approver } from './tabs/approval-tab';
import HistoryTab from './tabs/history-tab';

// Создание кастомной темы MUI
const theme = createTheme({
  palette: {
    primary: { main: '#3b82f6' }, // Основной цвет - синий
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Отключаем заглавные буквы в табах
          minHeight: '48px',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Отключаем заглавные буквы в кнопках
        },
      },
    },
  },
});

// Стилизованный скролл бар
const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f5f5f5',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#3b82f6',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#757575',
  },
};

// Стилизованные компоненты
const MainContainer = styled('main')(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '32px 16px',
  minHeight: '100vh', // Займёт всю высоту экрана
  display: 'flex',
  alignItems: 'center', // Вертикальное центрирование
  [theme.breakpoints.down('sm')]: {
    padding: '16px 8px',
    alignItems: 'flex-start', // На мобильных устройствах контент будет привязываться к верху
  },
}));

// Интерфейс для табов
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  onSubmit?: () => void;

  [key: string]: unknown; // Для остальных пропсов, если они есть
}

// Компонент панели таба
function TabPanel(props: TabPanelProps) {
  const { children, value, index, onSubmit, ...other } = props;

  // Общие стили для всех табов, чтобы они имели одинаковый размер
  const panelStyles: React.CSSProperties = {
    width: '100%',
    height: '600px', // Фиксированная высота для всех панелей
    position: 'relative',
    display: value === index ? 'flex' : 'none',
    flexDirection: 'column' as const,
    overflow: 'hidden', // Скрываем переполнение
  };

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} style={panelStyles} {...other}>
      {value === index && (
        <>
          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', ...scrollbarStyles }}>{children}</Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Button type="submit" variant="contained" color="primary" onClick={onSubmit}>ОТПРАВИТЬ</Button>
            <Button variant="contained" color="primary">СОХРАНИТЬ</Button>
            <Button variant="outlined">ОТМЕНИТЬ</Button>
          </Box>
        </>
      )}
    </div>
  );
}

// Схема валидации полей формы с использованием Zod
const formSchema = z
  .object({
    fullName: z.string().min(5, { message: 'ФИО должно содержать не менее 5 символов!' }),
    phone: z.string().regex(/^\+7[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/, { message: 'Формат: +7(900)000-00-00' }),
    organization: z.string().min(2, { message: 'Организация не указана!' }),
    email: z.string().email({ message: 'Укажите корректный @mail!' }),
    birthDate: z.preprocess(
      (val) => {
        // Если значение null или некорректная дата — возвращаем undefined, чтобы сработал required_error
        if (val === null || isNaN(new Date(val as string).getTime())) {
          return undefined;
        }
        return val;
      },
      z
        .date({
          required_error: 'Дата рождения не верна!', // Показывается, если поле пустое
          invalid_type_error: 'Некорректная дата!', // Показывается, если введён невалидный формат
        })
        .max(new Date(), {
          message: 'Дата рождения не может быть указана будущим числом!', // Проверка на будущую дату
        }),
    ),
    hasCar: z.string(),
    justification: z
      .string()
      .min(50, { message: 'Обоснование должно содержать не менее 50 символов!' })
      .max(500, { message: 'Максимум 500 символов!' }),
    startDate: z.date({ required_error: 'Укажите дату начала' }),
    endDate: z.date({ required_error: 'Укажите дату окончания' }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'Дата окончания должна быть позднее даты начала!',
    path: ['endDate'],
  });

// Основной компонент формы
export default function GuestPassForm() {
  // Состояние для активного таба (0 - основная информация, 1 - очереди согласования, 2 - история)
  const [tabValue, setTabValue] = useState(0);
  // Состояние для подсчета символов в поле обоснования
  const [characterCount, setCharacterCount] = useState(0);
  // Состояние для списка согласующих
  const [approvers, setApprovers] = useState<Approver[]>([]);
  // Состояние для отображения уведомлений
  const [alert, setAlert] = useState<{
    open: boolean
    message: string
    severity: 'error' | 'warning' | 'info' | 'success'
  }>({
    open: false,
    message: '',
    severity: 'error',
  });

  // Состояние для хранения фотографии профиля
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  // Состояние для отслеживания загрузки фотографии
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  // Обработчик изменения таба
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => setTabValue(newValue);

  // Инициализация формы с использованием react-hook-form и zod для валидации
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      organization: '',
      email: '',
      birthDate: new Date('1900-01-01T00:00:00'),
      hasCar: 'No',
      justification: '',
      startDate: addDays(new Date(), 1), // По умолчанию завтрашний день
      endDate: addDays(new Date(), 6), // По умолчанию через 6 дней
    },
    mode: 'onChange', // Валидация при изменении полей
  });


  // Отслеживаем значения полей для расчетов
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const justification = watch('justification');

  // Обновляем счетчик символов при изменении текста обоснования
  useEffect(() => {
    setCharacterCount(justification?.length || 0);
  }, [justification]);

  // Расчет разницы в днях между начальной и конечной датой
  const daysDifference = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;

  // Обработчик загрузки фотографии
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIsPhotoLoading(true);

      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        // Имитация задержки загрузки для демонстрации LoadingButton
        setTimeout(() => {
          setProfilePhoto(reader.result as string);
          setIsPhotoLoading(false);
        }, 1000);
      };

      reader.readAsDataURL(file);
    }
  };

  // Обработчик отправки формы
  const onSubmit = handleSubmit((data) => {
    // Проверяем наличие согласующих
    if (approvers.length === 0) {
      setAlert({
        open: true,
        message: 'Необходимо добавить хотя бы одного согласующего!',
        severity: 'error',
      });
      // Переключаемся на вкладку согласования
      setTabValue(1);
      return;
    }

    // Если все проверки пройдены, отправляем форму
    console.log('Данные формы:', data);
    console.log('Согласующие:', approvers);
    setAlert({
      open: true,
      message: 'Форма успешно отправлена!',
      severity: 'success',
    });
  });

  // Обработчик закрытия уведомления
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Функция для проверки валидности формы и наличия согласующих
  const validateAndSubmit = () => {
    // Проверяем наличие ошибок в форме
    const errorFields = Object.keys(errors);

    if (errorFields.length > 0) {
      // Создаем читаемые названия полей
      const fieldNames: Record<string, string> = {
        fullName: 'ФИО',
        phone: 'Контактный телефон',
        organization: 'Организация',
        email: 'Почтовый адрес',
        birthDate: 'Дата рождения',
        justification: 'Обоснование',
        startDate: 'Дата начала',
        endDate: 'Дата окончания',
        hasCar: 'Наличие автомобиля',
      };

      // Формируем список незаполненных полей
      const missingFields = errorFields.map((field) => fieldNames[field] || field).join(', ');

      setAlert({
        open: true,
        message: `Пожалуйста, заполните корректно следующие поля: ${missingFields}`,
        severity: 'error',
      });

      // Переключаемся на вкладку с основной информацией
      setTabValue(0);
      return;
    }

    // Если форма валидна, запускаем onSubmit
    onSubmit();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <MainContainer>
          <Card sx={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
            {/* Табы для переключения между разделами */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#3b82f6',
                  },
                }}
              >
                {/* Таб "Основное" */}
                <Tab
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight={500}>Основное</Typography>
                    </Box>
                  }
                />
                {/* Таб "Согласование" */}
                <Tab
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight={500}>Согласование</Typography>
                    </Box>
                  }
                />
                {/* Таб "История" */}
                <Tab
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight={500}>История</Typography>
                    </Box>
                  }
                />
              </Tabs>
            </Box>

            {/* Содержимое таба "Основная информация" */}
            <TabPanel value={tabValue} index={0} onSubmit={validateAndSubmit}>
              <Typography variant="h5" fontWeight="bold" mb={3} textAlign={{ xs: 'center', sm: 'left' }}>
                СОЗДАНИЕ ЗАЯВКИ НА ГОСТЕВОЙ ПРОПУСК
              </Typography>

              <form>
                <Grid container spacing={{ xs: 2, sm: 2 }}>
                  {/* Блок с фото профиля */}
                  <Grid container size={{ xs: 12, sm: 4 }} justifyContent="center" alignItems="center">
                    <Box
                      sx={{
                        width: 250,
                        height: 250,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 2,
                        ...(profilePhoto && {
                          backgroundImage: `url(${profilePhoto})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }),
                      }}
                    >
                      {!profilePhoto && <PersonIcon sx={{ width: 80, height: 80, color: 'white', mb: 2 }} />}

                      <input
                        accept="image/*"
                        type="file"
                        id="upload-photo"
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload}
                      />

                      <label
                        htmlFor="upload-photo"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                        }}
                      >
                        <LoadingButton
                          loading={isPhotoLoading}
                          loadingPosition="start"
                          startIcon={<CloudUploadIcon />}
                          variant="contained"
                          component="span"
                          fullWidth
                          sx={{
                            borderRadius: profilePhoto ? '0' : '0 0 8px 8px',
                            height: '48px',
                            bgcolor: profilePhoto ? 'rgba(0, 0, 0, 0.6)' : 'white',
                            color: profilePhoto ? 'white' : 'primary.main',
                            '&:hover': {
                              bgcolor: profilePhoto ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                            },
                          }}
                        >
                          {profilePhoto ? 'Изменить фото' : 'Добавить фото'}
                        </LoadingButton>
                      </label>
                    </Box>
                  </Grid>
                  {/* Левая колонка полей */}
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {/* Поле ФИО */}
                    <Controller
                      name="fullName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="ФИО"
                          placeholder="Укажите ФИО заявителя"
                          fullWidth
                          margin="normal"
                          error={!!errors.fullName}
                          helperText={errors.fullName?.message}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon color="primary" />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                    {/* Поле телефона */}
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Контактный телефон"
                          placeholder="Укажите контактный телефон заявителя"
                          fullWidth
                          margin="normal"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon color="primary" />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                    {/* Поле email */}
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Почтовый адрес"
                          placeholder="Укажите @mail заявителя"
                          fullWidth
                          margin="normal"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon color="primary" />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  {/* Правая колонка полей */}
                  <Grid size={{ xs: 12, sm: 4 }}>
                    {/* Поле даты рождения */}
                    <Controller
                      name="birthDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Дата рождения"
                          value={field.value}
                          onChange={field.onChange}
                          disableFuture
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              margin: 'normal',
                              error: !!errors.birthDate,
                              helperText: errors.birthDate?.message,
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CalendarIcon color="primary" />
                                  </InputAdornment>
                                ),
                              },
                            },
                          }}
                        />
                      )}
                    />
                    {/* Поле организации */}
                    <Controller
                      name="organization"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Организация"
                          placeholder="Укажите организацию заявителя"
                          fullWidth
                          margin="normal"
                          error={!!errors.organization}
                          helperText={errors.organization?.message}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BusinessIcon color="primary" />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                    {/* Поле наличия автомобиля */}
                    <Controller
                      name="hasCar"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth margin="normal" error={!!errors.hasCar}>
                          <InputLabel id="car-label">Наличие автомобиля</InputLabel>
                          <Select
                            {...field}
                            labelId="car-label"
                            label="Наличие автомобиля"
                            startAdornment={
                              <InputAdornment position="start">
                                <DirectionsCarIcon color="primary" />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="No">Нет</MenuItem>
                            <MenuItem value="Yes">Да</MenuItem>
                          </Select>
                          {errors.hasCar && <FormHelperText>{errors.hasCar.message}</FormHelperText>}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  {/* Блок обоснования */}
                  <Grid size={12}>
                    <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                      Обоснование
                    </Typography>
                    <Controller
                      name="justification"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.justification}>
                          <TextField
                            {...field}
                            multiline
                            minRows={4} // Используем minRows для возможности растягивания
                            maxRows={Number.POSITIVE_INFINITY} // Позволяет бесконечно растягиваться
                            placeholder="Укажите дополнительную информацию для получения пропуска"
                            error={!!errors.justification}
                            slotProps={{
                              input: {
                                endAdornment: field.value ? (
                                  <InputAdornment position="end">
                                    <IconButton
                                      edge="end"
                                      onClick={() => setValue('justification', '')}
                                      sx={{ position: 'absolute', top: 8, right: 8 }}
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ) : null,
                              },
                            }}
                          />
                          {/* Счетчик символов и сообщение об ошибке */}
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                            {errors.justification && (
                              <FormHelperText error>{errors.justification.message}</FormHelperText>
                            )}
                            <Typography variant="caption" color="text.secondary" ml="auto">
                              {characterCount}/500
                            </Typography>
                          </Box>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  {/* Блок периода действия пропуска */}
                  <Grid size={12}>
                    <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                      Период действия пропуска
                    </Typography>
                    <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
                      <Typography>Пропуск будет активен с</Typography>
                      {/* Поле даты начала */}
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            disablePast
                            slotProps={{
                              textField: {
                                size: 'small',
                                error: !!errors.startDate,
                                helperText: errors.startDate?.message,
                                sx: { width: 150 },
                              },
                            }}
                          />
                        )}
                      />
                      <Typography>по</Typography>
                      {/* Поле даты окончания */}
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            minDate={startDate}
                            slotProps={{
                              textField: {
                                size: 'small',
                                error: !!errors.endDate,
                                helperText: errors.endDate?.message,
                                sx: { width: 150 },
                              },
                            }}
                          />
                        )}
                      />
                    </Box>
                    {/* Отображение итогового периода */}
                    <Typography mt={1}>
                      Итоговый период действия пропуска составит -{' '}
                      <Typography component="span" color="primary.main" fontWeight="medium">
                        {daysDifference} суток
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </TabPanel>

            {/* Содержимое таба "Очереди согласования" */}
            <TabPanel value={tabValue} index={1} onSubmit={validateAndSubmit}>
              <ApprovalTab approvers={approvers} setApprovers={setApprovers} />
            </TabPanel>

            {/* Содержимое таба "История" */}
            <TabPanel value={tabValue} index={2} onSubmit={validateAndSubmit}>
              <HistoryTab />
            </TabPanel>
          </Card>
        </MainContainer>

        {/* Уведомление об успешности отправки формы */}
        <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
