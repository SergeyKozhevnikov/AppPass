'use client';

import { useState, useEffect, type SyntheticEvent } from 'react';
import { differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Card,
  Tabs,
  Tab,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Grid,
  InputAdornment,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  CircularProgress,
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

// Импорт компонентов, типов и утилит
import { theme } from '../styles/theme';
import { formSchema, defaultFormValues, fieldNames } from '../utils/helpers';
import { MainContainer } from './MainContainer';
import TabPanel from './TabPanel';
import PhotoUpload from './PhotoUpload';
import ApprovalTab from '../tabs/approval-tab';
import HistoryTab from '../tabs/history-tab';
import type { Approver, AlertState, HistoryOperation, GuestPassFormProps } from '../types';

// Импортируем API сервис
import { createPass } from '../services/api';

// Интерфейс для ответа API
interface CreatePassResponse {
  success: boolean;
  data: {
    id: string;
    date_created?: string;
    date_modified?: string;
  };
  message?: string;
  error?: string;
}

// Основной компонент формы
export default function GuestPassForm({ onClose }: GuestPassFormProps) {
  // Состояние для активного таба (0 - основная информация, 1 - очереди согласования, 2 - история)
  const [tabValue, setTabValue] = useState(0);
  // Состояние для подсчета символов в поле обоснования
  const [characterCount, setCharacterCount] = useState(0);
  // Состояние для списка согласующих
  const [approvers, setApprovers] = useState<Approver[]>([]);
  // Состояние для отображения уведомлений
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'error',
  });

  // Состояние для истории операций
  const [operations, setOperations] = useState<HistoryOperation[]>([]);

  // Состояние для отображения JSON данных
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [jsonData, setJsonData] = useState('');

  // Состояние для хранения фотографии профиля
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Состояние для индикатора загрузки
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Обработчик изменения таба
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => setTabValue(newValue);

  // Инициализация формы с использованием react-hook-form и zod для валидации
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
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

  // Функция для отображения уведомлений
  const showAlert = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  // Функция для форматирования сообщения об ошибке
  const formatErrorMessage = (error: unknown): string => {
    // Если это объект с полем 'error'
    if (typeof error === 'object' && error !== null && 'error' in error) {
      return `Ошибка: ${String((error as Record<string, unknown>).error)}`;
    }

    // Если это объект с полем 'message'
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return `Ошибка: ${String((error as Record<string, unknown>).message)}`;
    }

    // Если это ошибка, реализующая toString()
    if (typeof error === 'object' && error !== null && 'toString' in error) {
      const errorMsg = (error as { toString?(): string }).toString?.() || '';
      if (errorMsg.includes('database') || errorMsg.includes('SQL')) {
        return 'Ошибка базы данных. Пожалуйста, проверьте введенные данные или обратитесь к администратору.';
      }
      if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        return 'Ошибка сети. Пожалуйста, проверьте подключение к интернету и попробуйте снова.';
      }
      if (errorMsg.includes('500')) {
        return 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже или обратитесь к администратору.';
      }
      if (errorMsg.includes('400')) {
        return 'Ошибка валидации данных. Пожалуйста, проверьте правильность заполнения формы.';
      }
      if (errorMsg.includes('401') || errorMsg.includes('403')) {
        return 'Ошибка авторизации. У вас нет прав для выполнения этого действия.';
      }
    }

    // Если это просто строка
    if (typeof error === 'string') {
      return `Ошибка: ${error}`;
    }

    // Если ничего не подошло, возвращаем общее сообщение
    return 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.';
  };

  // Функция для создания JSON данных
  const createJsonData = () => {
    const formData = getValues();

    // Создаем объект с данными формы
    const jsonObject = {
      photo: profilePhoto || null,
      fullName: formData.fullName,
      phone: formData.phone,
      organization: formData.organization,
      email: formData.email,
      birthDate: formData.birthDate instanceof Date ? formData.birthDate.toISOString().split('T')[0] : null,
      hasCar: formData.hasCar,
      justification: formData.justification,
      startDate: formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : null,
      endDate: formData.endDate instanceof Date ? formData.endDate.toISOString().split('T')[0] : null,
      approvers: approvers,
    };

    return JSON.stringify(jsonObject, null, 2);
  };

  // Обработчик отправки формы
  const onSubmit = handleSubmit(async () => {
    // Проверяем наличие согласующих
    if (approvers.length === 0) {
      showAlert('Необходимо добавить хотя бы одного согласующего!', 'error');
      // Переключаемся на вкладку согласования
      setTabValue(1);
      return;
    }

    try {
      setIsSubmitting(true); // Включаем индикатор загрузки

      // Подготавливаем данные для отправки
      const formData = getValues();

      const passData = {
        fullName: formData.fullName,
        phone: formData.phone,
        organization: formData.organization,
        email: formData.email,
        birthDate: formData.birthDate instanceof Date ? formData.birthDate.toISOString().split('T')[0] : '',
        hasCar: formData.hasCar,
        justification: formData.justification,
        startDate: formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : '',
        endDate: formData.endDate instanceof Date ? formData.endDate.toISOString().split('T')[0] : '',
        photo: profilePhoto || undefined,
        approvers: approvers.map((approver) => ({
          name: approver.name,
          position: approver.position,
        })),
      };

      console.log('Отправляемые данные:', passData);

      // Отправляем данные на сервер
      const response = await createPass(passData) as CreatePassResponse;
      console.log('Ответ сервера:', response);

      if (response.success) {
        // Форматируем дату создания для отображения
        const dateCreated = response.data?.date_created
          ? new Date(response.data.date_created).toLocaleString('ru')
          : new Date().toLocaleString('ru');

        // Добавляем запись в историю
        const newOperation: HistoryOperation = {
          date: dateCreated,
          action: 'Отправка заявки',
          user: 'Тестов Тест Тестович',
        };
        setOperations([newOperation, ...operations]);

        // Показываем уведомление об успешной отправке
        showAlert(`Заявка успешно отправлена. ID: ${response.data?.id}`, 'success');

        // Создаем JSON данные для отображения
        const jsonData = createJsonData();
        setJsonData(jsonData);
        setJsonDialogOpen(true);
      } else {
        // Показываем уведомление об ошибке
        showAlert(`Ошибка при отправке заявки: ${response.message || response.error || 'Неизвестная ошибка'}`, 'error');
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      showAlert(`Произошла ошибка при отправке формы: ${(error as Error).message}`, 'error');
    } finally {
      setIsSubmitting(false); // Выключаем индикатор загрузки
    }
  });

  // Обработчик сохранения формы
  const onSave = () => {
    // Добавляем запись в историю
    const newOperation: HistoryOperation = {
      date: new Date().toLocaleString('ru'),
      action: 'Создан шаблон заявки',
      user: 'Тестов Тест Тестович',
    };
    setOperations([newOperation, ...operations]);

    // Показываем уведомление
    showAlert('Шаблон заявки успешно сохранен!', 'success');
  };

  // Обработчик закрытия уведомления
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Обработчик закрытия диалога с JSON
  const handleCloseJsonDialog = () => {
    setJsonDialogOpen(false);
  };

  // Функция для проверки валидности формы и наличия согласующих
  const validateAndSubmit = async () => {
    // Проверяем наличие ошибок в форме
    const errorFields = Object.keys(errors);

    if (errorFields.length > 0) {
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

    // Если форма валидна, запускаем onSubmit с обработкой промиса
    try {
      await onSubmit();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      // Форматируем сообщение об ошибке для пользователя
      const errorMessage = formatErrorMessage(error);
      setAlert({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  // Обработчик кнопки "Отменить"
  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <MainContainer>
          <Card sx={{ height: '100%', width: '100%', maxWidth: '100%', margin: '0 auto' }}>
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
                      <Typography variant="body1" fontWeight={500}>
                        Основное
                      </Typography>
                    </Box>
                  }
                />
                {/* Таб "Согласование" */}
                <Tab
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight={500}>
                        Согласование
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
                  }
                />
              </Tabs>
            </Box>

            {/* Содержимое таба "Основная информация" */}
            <TabPanel value={tabValue} index={0} onSubmit={validateAndSubmit} onSave={onSave} onCancel={handleCancel}>
              <form>
                <Grid container spacing={2}>
                  {/* Блок с фото профиля */}
                  <Grid container size={{ xs: 12, sm: 4 }} display="flex" justifyContent="center" alignItems="center">
                    <PhotoUpload
                      profilePhoto={profilePhoto}
                      onProfilePhotoChangeAction={setProfilePhoto}
                      onError={showAlert}
                    />
                  </Grid>

                  {/* Правая область с заголовком и полями */}
                  <Grid size={{ xs: 12, sm: 8 }} width="400px" alignContent="center">
                    <Typography variant="h5" fontWeight="bold" mb={3} textAlign={{ xs: 'center', sm: 'center' }}>
                      СОЗДАНИЕ ЗАЯВКИ НА ГОСТЕВОЙ ПРОПУСК
                    </Typography>

                    <Grid container spacing={2}>
                      {/* Левая колонка полей */}
                      <Grid size={{ xs: 12, sm: 6 }}>
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
                      <Grid size={{ xs: 12, sm: 6 }}>
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
                    </Grid>
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
            <TabPanel value={tabValue} index={1} onSubmit={validateAndSubmit} onSave={onSave} onCancel={handleCancel}>
              <ApprovalTab approvers={approvers} setApproversAction={setApprovers} />
            </TabPanel>

            {/* Содержимое таба "История" */}
            <TabPanel value={tabValue} index={2} onSubmit={validateAndSubmit} onSave={onSave} onCancel={handleCancel}>
              <HistoryTab operations={operations} />
            </TabPanel>
          </Card>
        </MainContainer>

        {/* Уведомление об успешности отправки формы */}
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            sx={{
              width: '100%',
              '& .MuiAlert-message': {
                maxWidth: '500px',
                wordBreak: 'break-word',
              },
            }}
          >
            {alert.message}
          </Alert>
        </Snackbar>

        {/* Диалог с JSON данными */}
        <Dialog open={jsonDialogOpen} onClose={handleCloseJsonDialog} maxWidth="md" fullWidth>
          <DialogTitle>Данные заявки (JSON)</DialogTitle>
          <DialogContent>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: '400px',
                fontSize: '0.875rem',
              }}
            >
              {jsonData}
            </Box>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={handleCloseJsonDialog} color="primary">
              Закрыть
            </MuiButton>
          </DialogActions>
        </Dialog>

        {/* Индикатор загрузки при отправке формы */}
        {isSubmitting && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
            }}
          >
            <CircularProgress color="primary" size={60} />
          </Box>
        )}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
