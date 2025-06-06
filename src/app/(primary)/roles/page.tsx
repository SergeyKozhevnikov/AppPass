// Страница управления ролями (Федор Г)
'use client'; // определяет компонент как клиентский

import Register from '@/components/RegisterModal';
import { Alert, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import React from 'react';
import UsersList from '@/components/UsersList';
import { alertStyle } from '@/styles/shared-styles';

const UsersPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // для диалоговвого окна
  const [requestResult, setRequestResult] = useState('');
  const [isOpenErrorAlert, setIsOpenErrorAlert] = useState(false);
  const [isOpenSuccessAlert, setIsOpenSuccessAlert] = useState(false);

  // Если успешно и, если ошибка
  useEffect(() => {
    if (requestResult === 'success') {
      setIsOpenSuccessAlert(true);
    } else if (requestResult === 'error') {
      setIsOpenErrorAlert(true);
    }
    setRequestResult('');
  }, [requestResult]);

  useEffect(() => {
    if (isOpenSuccessAlert === true) {
      setTimeout(() => {
        setIsOpenSuccessAlert(false);
      }, 7000); // исчезает через 7 сек
    }
  }, [isOpenSuccessAlert]);

  useEffect(() => {
    if (isOpen === false) {
      setIsOpenErrorAlert(false);
    }
  }, [isOpen]);

  return (
    <div>
      <section className="role-manage">
        {/* Кнопка создания нового пользователя */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsOpen(true)}
        >
          Создать пользователя
        </Button>

        {/* Сообщения об успехе и ошибке */}
        {isOpenSuccessAlert && (
          <Alert severity="success" sx={alertStyle}>
            Операция выполнена успешно
          </Alert>
        )}
        {isOpenErrorAlert && isOpen === true && (
          <Alert severity="error" sx={alertStyle}>
            Ошибка. Проверьте введенные данные
          </Alert>
        )}
        {/* Если isOpen-true, открыть диалоговое окно и передать ему параметры */}
        {isOpen && (
          <Register
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setResult={setRequestResult}
          />
        )}
      </section>
      <UsersList result={requestResult} setResult={setRequestResult}/>
    </div>
  );
};

export default UsersPage;
