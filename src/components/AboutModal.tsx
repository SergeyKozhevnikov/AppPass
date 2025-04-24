// Страница о программе (Иван А)

import React, { Dispatch, SetStateAction } from 'react';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Dialog, DialogContent } from '@mui/material';

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AboutPage = (props: IProps) => {
  const { isOpen, setIsOpen } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      sx={{ p: 0 }}
      maxWidth="md"
      fullWidth
    >
      <DialogContent sx={{ p: 0 }}>
        <Head>
          <title>О программе</title>
        </Head>
        <Container maxWidth="md" disableGutters>
          {/* Заголовок */}
          <div className="bg-blue-600 text-white py-4 text-center">
            <Typography variant="h4" component="h1">
              О программе
            </Typography>
          </div>

          {/* Основное содержимое */}
          <div className="p-6 border border-gray-300 rounded-lg space-y-6">
            <Typography variant="body1" paragraph>
              &quot;AppPass&quot; — это современное решение для автоматизации
              процесса заказа и управления пропусками на различные объекты. Наш
              проект создан, чтобы сделать взаимодействие между посетителями,
              сотрудниками и службами безопасности удобным, быстрым и
              безопасным.
            </Typography>
            <Typography variant="body1" paragraph>
              Система сочетает в себе простоту использования и надежность,
              обеспечивая защиту данных и эффективную обработку заявок. Мы
              стремимся помочь организациям любого масштаба оптимизировать
              процессы контроля доступа, сократить рутинные задачи и повысить
              уровень безопасности.
            </Typography>
            <Typography variant="body1" paragraph>
              &quot;AppPass&quot; — это шаг к цифровизации и упрощению работы с
              пропускными системами, который экономит время и делает
              взаимодействие максимально комфортным.
            </Typography>

            {/* Кнопка "Написать в поддержку" по центру */}
            <div className="flex justify-center">
              <Button
                variant="contained"
                href="/create_support_request"
                color="primary"
                className="px-8 py-2"
              >
                Написать в поддержку
              </Button>
            </div>
          </div>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default AboutPage;
