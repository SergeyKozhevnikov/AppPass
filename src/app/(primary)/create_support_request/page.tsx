import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const SupportRequestPage = () => {
    return (
        <>
            {/* Мета-данные страницы */}
            <Head>
                <title>Запрос в техническую поддержку</title>
            </Head>

            {/* Основной контейнер */}
            <Box className="flex flex-col items-center p-4">
                {/* Заголовок */}
                <Box className="bg-blue-500 text-white text-center py-2 mb-4 w-full">
                    <Typography variant="h4" component="h1">
                        Запрос в техническую поддержку
                    </Typography>
                </Box>

                {/* Форма */}
                <Box className="w-full h-full border border-blue-500 p-4 rounded">
                    <form className="w-full">
                        {/* Имя пользователя */}
                        <TextField
                            label="Имя пользователя"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mb-4"
                        />

                        {/* Заголовок инцидента */}
                        <TextField
                            label="Заголовок инцидента"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mb-4"
                        />

                        {/* Почта */}
                        <TextField
                            label="Почта"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mb-4"
                        />

                        {/* Контактный номер телефона */}
                        <TextField
                            label="Контактный номер телефона"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mb-4"
                        />

                        {/* Содержание */}
                        <TextField
                            label="Содержание"
                            variant="outlined"
                            multiline
                            rows={5}
                            fullWidth
                            margin="normal"
                            className="mb-4"
                        />

                        {/* Кнопка "Отправить" */}
                        <Button
                            type="submit"
                            variant="contained"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            Отправить
                        </Button>
                    </form>
                </Box>
            </Box>
        </>
    );
};

export default SupportRequestPage;