'use client';

import { usePathname } from 'next/navigation'; // Хук для получения текущего пути
import { List } from "@mui/material";
import { DashboardMenu } from "@/components/menus/DashboardMenu";
import { DefaultMenu } from "@/components/menus/DefaultMenu";

export function ConfigurableSidebar() {
  const pathname = usePathname(); // Получаем текущий путь

  // Логика для изменения списка в зависимости от пути
  const renderMenuItems = () => {
    // Проверяем, если путь содержит /dashboard или /profile
    if (pathname.includes("/dashboard") || pathname.includes("/profile")) {
      return <DashboardMenu />;
    }

    return <DefaultMenu />;
  };

  return <List>{renderMenuItems()}</List>;
}