import Image from "next/image";
import Link from 'next/link';
import { useSession } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <header style={{ backgroundColor: '#005F90' }} className="text-white shadow-md px-4 py-3">Загрузка...</header>;
  }

  // Для отладки — выведем всю сессию в консоль
  console.log("Session:", session);

  // Формируем отображаемое имя: имя + отчество > email > логин > "Гость"
  const user = session?.user;
  const userFullName = user?.name && user?.patronymic ? `${user.name} ${user.patronymic}` : null;
  const displayName = userFullName || user?.email || user?.login || "Гость";

  return (
    <header style={{ backgroundColor: '#005F90' }} className="text-white shadow-md">
      <div className="px-4 py-3 w-full">
        <div className="flex items-center justify-between w-full">
          {/* Логотип и название */}
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Image src="/assets/images/logo.svg" alt="Logo" width={205} height={94} />
            </Link>
          </div>
          {/* Логин пользователя */}
          <div className="text-right items-center flex">
            <Link href="/profile/" className="pr-1 flex items-center">
              <span className="pr-1">{displayName}</span>
              <span>
                <Image
                  src="/assets/images/avatar.svg"
                  alt="Перейти в профиль"
                  width={40}
                  height={40}
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}