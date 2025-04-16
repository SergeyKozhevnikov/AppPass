import Link from "next/link";
import Image from "next/image";
import "./Sidebar.css";

export function Sidebar() {
  return (
    <aside className="sidebar border-2 rounded m-0.5 px-5 py-5 min-w-[340px] h-full" style={{ borderColor: "#007EC0" }}>
      <div className="sidebar__chto-to"></div>
      <h1>This is change</h1>
      <nav>
        <li>
          <Link className="flex items-center mb-5" href="" title="Мои заявки"><Image className="mr-1" src="/assets/images/first-level.svg" alt="item" width={40} height={40} />Мои заявки</Link>

          <nav className="pl-10">
            <li><Link className="flex items-center mb-5" href=""><Image className="mr-1" src="/assets/images/second-level.svg" alt="item" width={30} height={30} />Черновки</Link></li>
            <li><Link className="flex items-center mb-5" href=""><Image className="mr-1" src="/assets/images/second-level.svg" alt="item" width={30} height={30} />На согласовании</Link></li>
            <li><Link className="flex items-center mb-5" href=""><Image className="mr-1" src="/assets/images/second-level.svg" alt="item" width={30} height={30} />Согласованные</Link></li>
            <li><Link className="flex items-center mb-5" href=""><Image className="mr-1" src="/assets/images/second-level.svg" alt="item" width={30} height={30} />Отклоненные</Link></li>
          </nav>

        </li>
        <li>
          <Link className="flex items-center mb-5" href="" title="Мои заявки"><Image className="mr-1" src="/assets/images/first-level-settings.svg" alt="item" width={40} height={40} />Настройки</Link>
        </li>
      </nav>
    </aside>
  );
}
