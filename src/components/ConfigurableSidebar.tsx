'use client';

import { usePathname } from 'next/navigation'; // Хук для получения текущего пути
import Link from 'next/link'; // Импортируем Link для переходов
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";

export function ConfigurableSidebar() {
  const pathname = usePathname(); // Получаем текущий путь

  // Логика для изменения списка в зависимости от пути
  const renderMenuItems = () => {
    if (pathname === "/dashboard") {
      return (
        <>
          <ListItemButton component={Link} href="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} href="/passwords">
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Passwords" />
          </ListItemButton>
        </>
      );
    } else if (pathname === "/settings") {
      return (
        <>
          <ListItemButton component={Link} href="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
          <ListItemButton component={Link} href="/passwords">
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Passwords" />
          </ListItemButton>
        </>
      );
    } else {
      return (
        <>
          <ListItemButton component={Link} href="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} href="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </>
      );
    }
  };

  return <List>{renderMenuItems()}</List>;
}