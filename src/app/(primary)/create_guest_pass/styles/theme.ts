import { createTheme } from "@mui/material"

// Создание кастомной темы MUI
export const theme = createTheme({
  palette: {
    primary: { main: "#3b82f6" }, // Основной цвет - синий
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none", // Отключаем заглавные буквы в табах
          minHeight: "48px",
          fontWeight: 500,
          fontSize: "0.875rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Отключаем заглавные буквы в кнопках
        },
      },
    },
  },
})

// Стилизованный скролл бар
export const scrollbarStyles = {
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f5f5f5",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#3b82f6",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#757575",
  },
}
