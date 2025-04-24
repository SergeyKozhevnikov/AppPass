"use client"

import type React from "react"
import {Box, Button, Stack} from "@mui/material"
import type {TabPanelProps} from "../types"
import {scrollbarStyles} from "../styles/theme"

// Компонент панели таба
export default function TabPanel(props: TabPanelProps) {
    const {children, value, index, onSubmit, onSave, onCancel, ...other} = props

    // Общие стили для всех табов
    const panelStyles: React.CSSProperties = {
        width: "100%",
        height: "95%",
        position: "relative",
        display: value === index ? "flex" : "none",
        flexDirection: "column",
        overflow: "hidden",
    }

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            style={panelStyles}
            {...other}
        >
            {value === index && (
                <>
                    {/* Основное содержимое с прокруткой */}
                    <Box sx={{
                        p: 3,
                        flexGrow: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        ...scrollbarStyles
                    }}>
                        {children}
                    </Box>

                    {/* Панель кнопок с фиксированной высотой */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center", // Центрируем по вертикали
                            p: 2,
                            borderTop: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "background.paper",
                            position: "sticky",
                            bottom: 0,
                            width: "100%",
                            minHeight: "72px", // Минимальная высота панели
                            boxSizing: "border-box", // Учитываем padding в высоте
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                width: "100%",
                                maxWidth: "600px",
                                justifyContent: "center",
                                alignItems: "center", // Выравнивание кнопок по центру вертикально
                            }}
                        >
                            {/* Кнопки с фиксированной высотой */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={onSubmit}
                                sx={{
                                    width: "150px",
                                    height: "40px", // Фиксированная высота
                                    minHeight: "40px", // Минимальная высота
                                    padding: "6px 16px", // Стандартные отступы MUI
                                }}
                            >
                                ОТПРАВИТЬ
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onSave}
                                sx={{
                                    width: "150px",
                                    height: "40px",
                                    minHeight: "40px",
                                    padding: "6px 16px",
                                }}
                            >
                                СОХРАНИТЬ
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                sx={{
                                    width: "150px",
                                    height: "40px",
                                    minHeight: "40px",
                                    padding: "6px 16px",
                                }}
                            >
                                ОТМЕНИТЬ
                            </Button>
                        </Stack>
                    </Box>
                </>
            )}
        </div>
    )
}