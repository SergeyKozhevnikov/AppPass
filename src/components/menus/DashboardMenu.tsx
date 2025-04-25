import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";
import Link from "next/link";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

export const DashboardMenu = () => (
  <>
    <ListItemButton component={Link} href="/dashboard">
      <ListItemIcon><TextSnippetIcon /></ListItemIcon>
      <ListItemText primary="Дашборд" />
    </ListItemButton>
    <ListItemButton component={Link} href="/passwords">
      <ListItemIcon>
        <LockIcon />
      </ListItemIcon>
      <ListItemText primary="Новый пользователь" />
    </ListItemButton>
    <ListItemButton component={Link} href="/roles">
      <ListItemIcon>
        <GroupIcon />
      </ListItemIcon>
      <ListItemText primary="Управление ролями" />
    </ListItemButton>
  </>
);