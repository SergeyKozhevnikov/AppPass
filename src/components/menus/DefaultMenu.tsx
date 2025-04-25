import { useState } from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Collapse
} from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Link from "next/link";

export const DefaultMenu = () => {
  const [openRequests, setOpenRequests] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  const handleRequestsClick = () => {
    setOpenRequests(!openRequests);
  };

  const handleSettingsClick = () => {
    setOpenSettings(!openSettings);
  };

  return (
    <List component="nav">
      {/* Основной пункт "Мои заявки" с выпадающим меню */}
      <ListItemButton onClick={handleRequestsClick}>
        <ListItemIcon><TextSnippetIcon /></ListItemIcon>
        <ListItemText primary="Мои заявки" />
        {openRequests ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      {/* Подменю для "Мои заявки" */}
      <Collapse in={openRequests} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} component={Link} href="/requests/drafts">
            <ListItemIcon><TextSnippetIcon /></ListItemIcon>
            <ListItemText primary="Черновики" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} component={Link} href="/requests/inreview">
            <ListItemIcon><TextSnippetIcon /></ListItemIcon>
            <ListItemText primary="На согласовании" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} component={Link} href="/requests/approved">
            <ListItemIcon><TextSnippetIcon /></ListItemIcon>
            <ListItemText primary="Согласованные" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} component={Link} href="/requests/rejected">
            <ListItemIcon><TextSnippetIcon /></ListItemIcon>
            <ListItemText primary="Отклоненные" />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton component={Link} href="/dashboard">
        <ListItemIcon><TextSnippetIcon /></ListItemIcon>
        <ListItemText primary="Дашборд" />
      </ListItemButton>

      {/* Подменю для "Настройки" (пока пустое, как в макете) */}
      <Collapse in={openSettings} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Здесь могут быть подпункты настроек */}
        </List>
      </Collapse>
    </List>
  );
};