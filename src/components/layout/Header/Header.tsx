import Image from "next/image";
import Link from 'next/link';

export function Header() {
  return (
    <header style={{ backgroundColor: '#005F90' }} className="text-white shadow-md">
      <div className="px-4 py-3 w-full">
        <div className="flex items-center justify-between w-full">
          {/* Логотип и название */}
          <div className="flex items-center space-x-3">
            {/* SVG логотипа (простая иконка пропуска) */}
            <Link href="/">
              <Image src="/assets/images/logo.svg" alt="Logo" width={205} height={94} />
            </Link>
          </div>
          {/* Имя пользователя */}
          <div className="text-right items-center flex">
            <Link href="/profile/" className="pr-1 flex items-center">
              <span className="pr-1">Беликова А.В.</span>
              <span><Image src="/assets/images/avatar.svg" alt="Перейти в профиль" width={40} height={40} /></span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}