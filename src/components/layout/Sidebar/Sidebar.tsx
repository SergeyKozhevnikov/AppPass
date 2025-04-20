'use client';

import Link from "next/link";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export function Sidebar() {
  const headerHeight = process.env.NEXT_PUBLIC_HEADER_HEIGHT;

  return (
    <div
      style={{
        width: 250,
        padding: "1rem",
        borderColor: "#007EC0",
        height: `calc(100vh - ${headerHeight}px)`,  // Используем переменную окружения
      }}
      className="px-5 py-5 layout__main flex-1 h-full border border-2 m-0.5 rounded"
    >
      <List>
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

        <ListItemButton component={Link} href="/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItemButton component={Link} href="/about">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItemButton>

        <ListItemButton component={Link} href="/logout">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );
}