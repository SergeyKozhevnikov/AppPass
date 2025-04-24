// src/components/RequestFilter.tsx
"use client"

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Fade,
    Box,
    Button,
    TextField,
    styled
} from '@mui/material';
import type { TransitionProps } from "@mui/material/transitions";
import AddIcon from '@mui/icons-material/Add';
import GuestPassForm from "@/app/(primary)/create_guest_pass/components/GuestPassForm";

// Стилизованный компонент для плавного фона
const BlurredBackdrop = styled('div')({
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(0,0,0,0.1)',
});

// Анимация
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return (
        <Fade
            ref={ref}
            {...props}
            timeout={{ enter: 450, exit: 300 }}
            easing={{
                enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
                exit: 'cubic-bezier(0.7, 0, 0.84, 0)'
            }}
        />
    );
});

const RequestFilter: React.FC = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <TextField
                    type="date"
                    defaultValue="2025-03-01"
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'box-shadow 0.3s',
                            '&:hover': {
                                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                            }
                        }
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    Фильтр
                </Button>
                <TextField
                    placeholder="Поиск"
                    size="small"
                    sx={{
                        minWidth: 250,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'box-shadow 0.3s',
                            '&:hover': {
                                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                            }
                        }
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    Найти
                </Button>
                <Box flexGrow={1} />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                    sx={{
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    Создать
                </Button>
            </Box>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                slots={{ backdrop: BlurredBackdrop }}
                sx={{
                    '& .MuiDialog-container': {
                        alignItems: 'flex-start',
                        pt: 10
                    },
                    '& .MuiDialog-paper': {
                        bgcolor: 'rgba(245, 245, 245, 0.98)',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        transformOrigin: 'center top',
                        overflow: 'hidden',
                        maxWidth: 'lg',
                        margin: 2,
                        height: 'calc(100% - 32px)'
                    },
                }}
            >
                <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                    <Box sx={{
                        height: '100%',
                        overflow: 'auto',
                        opacity: 0,
                        animation: 'fadeIn 0.5s ease-out forwards',
                        '@keyframes fadeIn': {
                            '0%': { opacity: 0 },
                            '100%': { opacity: 1 }
                        }
                    }}>
                        <GuestPassForm onClose={handleClose} />
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RequestFilter;