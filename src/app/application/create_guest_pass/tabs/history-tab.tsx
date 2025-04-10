"use client"
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

// Пример данных для истории операций
const operations = [
    {
        date: "01.04.2025, 18:10:06",
        action: "Отправка заявки",
        user: "Иванов Иван Иванович",
    },
    {
        date: "01.04.2025, 18:09:41",
        action: "Сохранение черновика",
        user: "Иванов Иван Иванович",
    },
]

export default function HistoryTab() {
    return (
        <Box sx={{ width: "100%" }}>
            {/* Подзаголовок для истории операций */}
            <Typography variant="h5" component="h2" gutterBottom>
                История операций
            </Typography>

            {/* Таблица с историей операций */}
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
        </Box>
    )
}
