'use client';
// Импорт необходимых библиотек и компонентов
import { useState, useEffect, SyntheticEvent } from 'react';
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

// Стилизованные компоненты
const MainContainer = styled('main')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '16px',
});

// Интерфейс для табов
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  [key: string]: unknown; // Для остальных пропсов, если они есть
}

// Компонент панели таба
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Схема валидации формы с использованием Zod
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
      z.date({
        required_error: "Дата рождения не верна!", // Показывается, если поле пустое
        invalid_type_error: "Некорректная дата!",  // Показывается, если введён невалидный формат
      }).max(new Date(), {
        message: "Дата рождения не может быть указана будущим числом!", // Проверка на будущую дату
      })
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

  // Обработчик отправки формы
  const onSubmit = (data: Record<string, unknown>) => {
    console.log(data);
    alert('Форма отправлена!');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <MainContainer>
          <Card sx={{ maxWidth: 1200, margin: '0 auto' }}>
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
                {/* Таб "Основная информация" */}
                <Tab
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight={500}>
                        Основная информация
                      </Typography>
                    </Box>
                  }
                />
                {/* Таб "Очереди согласования" */}
                <Tab
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight={500}>
                        Очереди согласования
                      </Typography>
                    </Box>
                  }
                />
                {/* Таб "История" */}
                <Tab
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight={500}>
                        История
                      </Typography>
                    </Box>
                  } />
              </Tabs>
            </Box>

            {/* Содержимое таба "Основная информация" */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h5" fontWeight="bold" mb={3} textAlign={{ xs: 'center', sm: 'left' }}>
                СОЗДАНИЕ ЗАЯВКИ НА ГОСТЕВОЙ ПРОПУСК
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container direction="column" spacing={3}>
                  {/* Блок с фото профиля */}
                    <Grid item xs={12} container direction="column" alignItems="center">
                    <Box sx={{ width: 200, height: 200, bgcolor: '#3b82f6', alignItems: "center"}}>
                      <PersonIcon sx={{ width: 80, height: 80, color: 'white'}} />
                    </Box>
                  </Grid>

                  <Grid container item flexWrap="nowrap" direction="row" size={12} alignItems="center">
                    {/* Левая колонка полей */}
                    <Grid item direction="column" size={6}>
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
                    <Grid item direction="column" size={6}>
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
                            placeholder='Укажите организацию заявителя'
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
                  </Grid>

                  {/* Блок обоснования */}
                  <Grid item size={12}>
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
                            minRows={4}  // Используем minRows для возможности растягивания
                            maxRows={Infinity}  // Позволяет бесконечно растягиваться
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
                  <Grid item xs={12}>
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

                  {/* Кнопки действий */}
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                      ОТПРАВИТЬ
                    </Button>
                    <Button variant="contained" color="primary">
                      СОХРАНИТЬ
                    </Button>
                    <Button variant="outlined">ОТМЕНИТЬ</Button>
                  </Grid>
                </Grid>
              </form>
            </TabPanel>

            {/* Содержимое таба "Очереди согласования" */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ minHeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Очередь согласования пуста</Typography>
              </Box>
            </TabPanel>

            {/* Содержимое таба "История" */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ minHeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">История пуста</Typography>
              </Box>
            </TabPanel>
          </Card>
        </MainContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
}