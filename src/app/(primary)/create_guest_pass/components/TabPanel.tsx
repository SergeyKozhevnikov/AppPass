"use client"

import type React from "react"
import { Box, Button } from "@mui/material"
import type { TabPanelProps } from "../types"
import { scrollbarStyles } from "../styles/theme"

// Компонент панели таба
export default function TabPanel(props: TabPanelProps) {
  const { children, value, index, onSubmit, ...other } = props

  // Общие стили для всех табов, чтобы они имели одинаковый размер
  const panelStyles: React.CSSProperties = {
    width: "100%",
    height: "600px", // Фиксированная высота для всех панелей
    position: "relative",
    display: value === index ? "flex" : "none",
    flexDirection: "column" as const,
    overflow: "hidden", // Скрываем переполнение
  }

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} style={panelStyles} {...other}>
      {value === index && (
        <>
          <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", overflowX: "hidden", ...scrollbarStyles }}>{children}</Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <Button type="submit" variant="contained" color="primary" onClick={onSubmit}>
              ОТПРАВИТЬ
            </Button>
            <Button variant="contained" color="primary">
              СОХРАНИТЬ
            </Button>
            <Button variant="outlined">ОТМЕНИТЬ</Button>
          </Box>
        </>
      )}
    </div>
  )
}
