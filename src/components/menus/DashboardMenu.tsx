import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import Link from "next/link";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

export const DashboardMenu = () => (
  <>
    <ListItemButton component={Link} href="/dashboard">
      <ListItemIcon><TextSnippetIcon /></ListItemIcon>
      <ListItemText primary="Дашборд" />
    </ListItemButton>
    <ListItemButton component={Link} href="/roles">
      <ListItemIcon>
        <GroupIcon />
      </ListItemIcon>
      <ListItemText primary="Управление ролями" />
    </ListItemButton>
  </>
);