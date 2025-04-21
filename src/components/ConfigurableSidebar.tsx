'use client';

import { usePathname } from 'next/navigation'; // Хук для получения текущего пути
import { List } from "@mui/material";
import { DashboardMenu } from "@/components/menus/DashboardMenu";
import { DefaultMenu } from "@/components/menus/DefaultMenu";

export function ConfigurableSidebar() {
  const pathname = usePathname(); // Получаем текущий путь

  // Логика для изменения списка в зависимости от пути
  const renderMenuItems = () => {
    switch (true) {
      case pathname.includes("/dashboard"):
        return <DashboardMenu />;
      case pathname.includes("/profile"):
        return <DashboardMenu />;
      case pathname.includes("/roles"):
        return <DashboardMenu />;
      default:
        return <DefaultMenu />;
    }
  };

  return <List>{renderMenuItems()}</List>;
}