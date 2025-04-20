import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";

export const DashboardMenu = () => (
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