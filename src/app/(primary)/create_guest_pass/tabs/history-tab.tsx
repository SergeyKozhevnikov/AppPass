"use client"

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { operations } from "../data/historyData"

export default function HistoryTab() {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Подзаголовок для истории операций */}
      <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
        История операций
      </Typography>

      {/* Проверяем, пуст ли список операций */}
      {operations.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            История событий по заявке пуста
          </Typography>
        </Box>
      ) : (
        /* Таблица с историей операций */
        <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 1 }}>
          <Table>
            {/* Заголовки столбцов */}
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ width: "25%", fontWeight: "bold", color: "#757575" }}>ДАТА И ВРЕМЯ</TableCell>
                <TableCell sx={{ width: "40%", fontWeight: "bold", color: "#757575" }}>ДЕЙСТВИЕ</TableCell>
                <TableCell sx={{ width: "35%", fontWeight: "bold", color: "#757575" }}>ПОЛЬЗОВАТЕЛЬ</TableCell>
              </TableRow>
            </TableHead>
            {/* Тело таблицы с данными */}
            <TableBody>
              {operations.map((op, index) => (
                <TableRow key={index}>
                  <TableCell>{op.date}</TableCell>
                  <TableCell>{op.action}</TableCell>
                  <TableCell>{op.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
