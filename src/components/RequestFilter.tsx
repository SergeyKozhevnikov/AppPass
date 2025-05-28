'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Fade,
  Box,
  Button,
  TextField,
  styled,
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import AddIcon from '@mui/icons-material/Add';
import GuestPassForm from '@/app/(primary)/create_guest_pass/components/GuestPassForm';

type RequestFilterProps = {
  onFilterChange: (filters: { date: string; search: string }) => void;
};

// Кастомный Backdrop с анимацией появления/исчезания
const BlurredBackdrop = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(0px)',
  zIndex: 1200,
  opacity: 0,
  pointerEvents: 'none',
  animation: 'fadeInBackdrop 0.4s ease forwards',
  '@keyframes fadeInBackdrop': {
    from: {
      opacity: 0,
      backdropFilter: 'blur(0px)',
    },
    to: {
      opacity: 1,
      backdropFilter: 'blur(8px)',
    },
  },
  '.MuiDialog-root &': {
    animation: 'fadeOutBackdrop 0.3s ease forwards',
    animationPlayState: 'paused',
    '@keyframes fadeOutBackdrop': {
      from: {
        opacity: 1,
        backdropFilter: 'blur(8px)',
      },
      to: {
        opacity: 0,
        backdropFilter: 'blur(0px)',
      },
    },
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return (
    <Fade
      ref={ref}
      {...props}
      timeout={{ enter: 450, exit: 300 }}
      easing={{
        enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
        exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
      }}
    />
  );
});

const RequestFilter: React.FC<RequestFilterProps> = ({ onFilterChange }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // !!!!! ОБНОВЛЕНИЕ фильтров при изменении полей (автоматически)
  useEffect(() => {
    onFilterChange({ date, search });
  }, [date, search, onFilterChange]);

  // Обработчик сброса фильтров
  const handleReset = () => {
    setDate('');
    setSearch('');
    // onFilterChange вызовется автоматически из useEffect после сброса состояний
  };

  return (
    <>
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
              },
            },
          }}
        />
        <TextField
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
              },
            },
          }}
        />
        {/* Кнопка сброса */}
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{
            borderRadius: 2,
            whiteSpace: 'nowrap',
            height: 36,
            color: '#005e91',
            borderColor: '#005e91',
            '&:hover': {
              backgroundColor: 'rgba(0, 94, 145, 0.1)', // легкий фон при ховере
              borderColor: '#005e91',
            },
          }}
        >
          Сбросить
        </Button>

        <Box flexGrow={1} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{
            borderRadius: 2,
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
          }}
        >
          Создать
        </Button>
      </Box>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        slots={{ backdrop: BlurredBackdrop }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
            pt: 10,
          },
          '& .MuiDialog-paper': {
            bgcolor: 'rgba(245, 245, 245, 0.98)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transformOrigin: 'center top',
            overflow: 'hidden',
            maxWidth: 'lg',
            margin: 2,
            height: 'calc(100% - 32px)',
            zIndex: 1301,
          },
        }}
      >
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              overflow: 'auto',
              opacity: 0,
              animation: 'fadeIn 0.5s ease-out forwards',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          >
            <GuestPassForm onClose={handleClose} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestFilter;