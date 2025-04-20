'use client';

import Link from "next/link";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { ConfigurableSidebar } from "@/components/ConfigurableSidebar"; // Подключаем новый компонент

export function Sidebar() {
  const headerHeight = process.env.NEXT_PUBLIC_HEADER_HEIGHT;

  return (
    <div
      style={{
        width: 250,
        padding: "1rem",
        borderColor: "#007EC0",
        height: `calc(100vh - ${headerHeight}px)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      className="px-5 py-5 layout__main flex-1 h-full border border-2 m-0.5 rounded"
    >
      {/* Динамическое меню, в зависимости от текущего пути */}
      <ConfigurableSidebar />

      <Divider sx={{ my: 2 }} />

      {/* Второй список прижат к низу */}
      <List style={{ marginTop: 'auto' }}>
        <ListItemButton component={Link} href="/about">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="О системе" />
        </ListItemButton>

        <ListItemButton component={Link} href="/logout">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Выйти" />
        </ListItemButton>
      </List>
    </div>
  );
}