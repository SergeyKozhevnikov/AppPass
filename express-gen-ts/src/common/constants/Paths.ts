/**
 * Пути для роутинга
 */
export default {
  // Базовый путь
  Base: {
    Api: "/api",
  },

  // API пути
  Api: {
    Passes: "/passes",
    Pass: "/passes/:id",
  },
} as const
