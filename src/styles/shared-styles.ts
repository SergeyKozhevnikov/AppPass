// Общие стили для некоторых компонентов
// Стилизованный скролл бар
export const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f5f5f5',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#1976d2',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#757575',
  },
};

// Стиль для Alert (стр. профиль и создание пользователя)
export const alertStyle = {
  justifyContent: 'center',
  position: 'absolute',
  maxWidth: '368px',
  zIndex: 1301,
  bottom: 20,
  right: 20,
  m: 'auto',
};
