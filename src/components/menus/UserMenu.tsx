import { useState } from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Collapse,
} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Link from 'next/link';

export const UserMenu = () => {
  const [openRequests, setOpenRequests] = useState(true);

  const handleRequestsClick = () => {
    setOpenRequests(!openRequests);
  };

  return (
    <List component="nav">
      <ListItemButton component={Link} href="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Дашборд" />
      </ListItemButton>

      {/* Основной пункт "Мои заявки" с выпадающим меню */}
      <ListItemButton onClick={handleRequestsClick}>
        <ListItemIcon>
          <TextSnippetIcon />
        </ListItemIcon>
        <ListItemText primary="Мои заявки" />
        {openRequests ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      {/* Подменю для "Мои заявки" */}
      <Collapse in={openRequests} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            sx={{ pl: 4 }}
            component={Link}
            href="/requests/drafts"
          >
            <ListItemIcon>
              <TextSnippetIcon />
            </ListItemIcon>
            <ListItemText primary="Ожидает согласования" />
          </ListItemButton>
          <ListItemButton
            sx={{ pl: 4 }}
            component={Link}
            href="/requests/inreview"
          >
            <ListItemIcon>
              <TextSnippetIcon />
            </ListItemIcon>
            <ListItemText primary="Согласованные" />
          </ListItemButton>
          <ListItemButton
            sx={{ pl: 4 }}
            component={Link}
            href="/requests/approved"
          >
            <ListItemIcon>
              <TextSnippetIcon />
            </ListItemIcon>
            <ListItemText primary="На согласовании" />
          </ListItemButton>
          <ListItemButton
            sx={{ pl: 4 }}
            component={Link}
            href="/requests/rejected"
          >
            <ListItemIcon>
              <TextSnippetIcon />
            </ListItemIcon>
            <ListItemText primary="Отклоненные" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
};
