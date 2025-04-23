
import React from 'react';
import UsersList from '@/components/UsersList';

const UsersPage: React.FC = () => {
  return (
    <div>
      <h1>Управление ролями</h1>
      <UsersList />
    </div>
  );
};

export default UsersPage;
