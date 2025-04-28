// файл для утилит и вспомогательных функций
export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}