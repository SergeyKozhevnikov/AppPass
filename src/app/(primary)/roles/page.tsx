// Страница управления ролями (Федор Г)
'use client'; // определяет компонент как клиентский

import Register from '@/components/RegisterModal';
import { Button } from '@mui/material';
import { useState } from 'react';
import React from 'react';
import UsersList from '@/components/UsersList';

const UsersPage: React.FC = () => {
  // для открытия диалоговвого окна
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <h1>Управление пользователями</h1>
      <section className="role-manage">
        {/* Кнопка создания нового пользователя */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsOpen(true)}
        >
          Создать пользователя
        </Button>

        {/* Условие, если isOpen-true, открыть диалоговое окно и передать ему параметры isOpen и setIsOpen*/}
        {isOpen && <Register isOpen={isOpen} setIsOpen={setIsOpen} />}

        <h1 className="role-manage__title">Управление ролями</h1>
      </section>
      <UsersList />
    </div>
  );
};

export default UsersPage;
