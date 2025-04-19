import { styled } from "@mui/material"

// Стилизованные компоненты
export const MainContainer = styled("main")(({ theme }) => ({
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "32px 16px",
  minHeight: "100vh", // Займёт всю высоту экрана
  display: "flex",
  alignItems: "center", // Вертикальное центрирование
  [theme.breakpoints.down("sm")]: {
    padding: "16px 8px",
    alignItems: "flex-start", // На мобильных устройствах контент будет привязываться к верху
  },
}))
