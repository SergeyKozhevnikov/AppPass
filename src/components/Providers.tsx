// Провайдеры сессии (авторизирован пользователь или нет)
'use client';

import { SessionProvider } from 'next-auth/react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
