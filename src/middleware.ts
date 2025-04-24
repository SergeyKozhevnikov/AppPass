export { default } from 'next-auth/middleware';

// набор роутов, которые будут закрыты для неавторизированных пользователей
// обеспечит защиту любых маршрутов, кроме тех, что относятся к каталогам register, login, api, assets
export const config = {
  matcher: ['/((?!register|api|login|assets).*)'],
};
