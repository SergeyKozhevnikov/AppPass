"use client"

import { useState, useEffect, type SyntheticEvent } from "react"
import { differenceInDays } from "date-fns"
import { ru } from "date-fns/locale"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import BusinessIcon from "@mui/icons-material/Business"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import ClearIcon from "@mui/icons-material/Clear"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { CalendarIcon } from "@mui/x-date-pickers"

// Импорт компонентов, типов и утилит
import { theme } from "./styles/theme"
import { formSchema, defaultFormValues, fieldNames } from "./utils/helpers"
import { MainContainer } from "./components/MainContainer"
import TabPanel from "./components/TabPanel"
import PhotoUpload from "./components/PhotoUpload"
import ApprovalTab from "./tabs/approval-tab"
import HistoryTab from "./tabs/history-tab"
import type { Approver, AlertState } from "./types"

// Основной компонент формы
export default function GuestPassForm() {
  // Состояние для активного таба (0 - основная информация, 1 - очереди согласования, 2 - история)
  const [tabValue, setTabValue] = useState(0)
  // Состояние для подсчета символов в поле обоснования
  const [characterCount, setCharacterCount] = useState(0)
  // Состояние для списка согласующих
  const [approvers, setApprovers] = useState<Approver[]>([])
  // Состояние для отображения уведомлений
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "error",
  })

  // Состояние для хранения фотографии профиля
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  // Обработчик изменения таба
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => setTabValue(newValue)

  // Инициализация формы с использованием react-hook-form и zod для валидации
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
    mode: "onChange", // Валидация при изменении полей
  })

  // Отслеживаем значения полей для расчетов
  const startDate = watch("startDate")
  const endDate = watch("endDate")
  const justification = watch("justification")

  // Обновляем счетчик символов при изменении текста обоснования
  useEffect(() => {
    setCharacterCount(justification?.length || 0)
  }, [justification])

  // Расчет разницы в днях между начальной и конечной датой
  const daysDifference = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0

  // Обработчик отправки формы
  const onSubmit = handleSubmit((data) => {
    // Проверяем наличие согласующих
    if (approvers.length === 0) {
      setAlert({
        open: true,
        message: "Необходимо добавить хотя бы одного согласующего!",
        severity: "error",
      })
      // Переключаемся на вкладку согласования
      setTabValue(1)
      return
    }

    // Если все проверки пройдены, отправляем форму
    console.log("Данные формы:", data)
    console.log("Согласующие:", approvers)
    setAlert({
      open: true,
      message: "Форма успешно отправлена!",
      severity: "success",
    })
  })

  // Обработчик закрытия уведомления
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  // Функция для проверки валидности формы и наличия согласующих
  const validateAndSubmit = () => {
    // Проверяем наличие ошибок в форме
    const errorFields = Object.keys(errors)

    if (errorFields.length > 0) {
      // Формируем список незаполненных полей
      const missingFields = errorFields.map((field) => fieldNames[field] || field).join(", ")

      setAlert({
        open: true,
        message: `Пожалуйста, заполните корректно следующие поля: ${missingFields}`,
        severity: "error",
      })

      // Переключаемся на вкладку с основной информацией
      setTabValue(0)
      return
    }

    // Если форма валидна, запускаем onSubmit
    onSubmit()
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <MainContainer>
          <Card sx={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}>
            {/* Табы для переключения между разделами */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#3b82f6",
                  },
                }}
              >
                {/* Таб "Основное" */}
                <Tab
                  label={
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Typography variant="body1" fontWeight={500}>
                        Основное
                      </Typography>
                    </Box>
                  }
                />
                {/* Таб "Согласование" */}
                <Tab
                  label={
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Typography variant="body1" fontWeight={500}>
                        Согласование
                      </Typography>
                    </Box>
                  }
                />
                {/* Таб "История" */}
                <Tab
                  label={
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Typography variant="body1" fontWeight={500}>
                        История
                      </Typography>
                    </Box>
                  }
                />
              </Tabs>
            </Box>

            {/* Содержимое таба "Основная информация" */}
            <TabPanel value={tabValue} index={0} onSubmit={validateAndSubmit}>
              <Typography variant="h5" fontWeight="bold" mb={3} textAlign={{ xs: "center", sm: "left" }}>
                СОЗДАНИЕ ЗАЯВКИ НА ГОСТЕВОЙ ПРОПУСК
              </Typography>

              <form>
                <Grid container spacing={{ xs: 2, sm: 2 }}>
                  {/* Блок с фото профиля */}
                  <Grid container size={{ xs: 12, sm: 4 }} justifyContent="center" alignItems="center">
                    <PhotoUpload profilePhoto={profilePhoto} onProfilePhotoChangeAction={setProfilePhoto} />
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
                              margin: "normal",
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
                                      onClick={() => setValue("justification", "")}
                                      sx={{ position: "absolute", top: 8, right: 8 }}
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
                                size: "small",
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
                                size: "small",
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
                      Итоговый период действия пропуска составит -{" "}
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
              <ApprovalTab approvers={approvers} setApproversAction={setApprovers} />
            </TabPanel>

            {/* Содержимое таба "История" */}
            <TabPanel value={tabValue} index={2} onSubmit={validateAndSubmit}>
              <HistoryTab />
            </TabPanel>
          </Card>
        </MainContainer>

        {/* Уведомление об успешности отправки формы */}
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
            {alert.message}
          </Alert>
        </Snackbar>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
