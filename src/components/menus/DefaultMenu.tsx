import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import Link from "next/link";

export const DefaultMenu = () => (
  <>
    <ListItemButton component={Link} href="/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Дашборд" />
    </ListItemButton>
    <ListItemButton component={Link} href="/settings">
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Настойки" />
    </ListItemButton>
  </>
);
