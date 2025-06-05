import { useState } from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Collapse,
} from '@mui/material';
import RecentActorsIcon from '@mui/icons-material/RecentActorsOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import Link from 'next/link';

export const AdminMenu = () => {
  const [openRequests, setOpenRequests] = useState(true);
  const [openOpportunities, setOpenOpportunities] = useState(true);

  const handleRequestsClick = () => {
    setOpenRequests(!openRequests);
  };

  const handleOpportunitiesClick = () => {
    setOpenOpportunities(!openOpportunities);
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
            href="/requests/rejected"
          >
            <ListItemIcon>
              <TextSnippetIcon />
            </ListItemIcon>
            <ListItemText primary="Отклоненные" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Основной пункт "Панель администратора" с выпадающим меню */}
      <ListItemButton onClick={handleOpportunitiesClick}>
        <ListItemIcon>
          <ManageAccountsIcon />
        </ListItemIcon>
        <ListItemText primary="Панель администратора" />
        {openOpportunities ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      {/* Подменю для "Панель администратора" */}
      <Collapse in={openOpportunities} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} component={Link} href="/">
            <ListItemIcon>
              <RecentActorsIcon />
            </ListItemIcon>
            <ListItemText primary="Заявки пользователей" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4 }} component={Link} href="/roles">
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Управление ролями" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
};
