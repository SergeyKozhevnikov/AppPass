import { styled } from "@mui/material"

// Стилизованные компоненты
export const MainContainer = styled("main")(({ theme }) => ({
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  margin: "0 auto",
  padding: "32px 16px",
  display: "flex",
  alignItems: "center", // Вертикальное центрирование
  [theme.breakpoints.down("sm")]: {
    padding: "16px 8px",
    alignItems: "flex-start", // На мобильных устройствах контент будет привязываться к верху
  },
}))
