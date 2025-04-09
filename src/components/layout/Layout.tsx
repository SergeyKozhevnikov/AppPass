// Обертка для других страниц
import './Layout.css';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar/Sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  const showSidebar: boolean = true;

  return (
    <>
      <Header />
      <div className="layout__wrapper">
        {showSidebar && <Sidebar />}
        <main className="layout__main">{children}</main>
      </div>
    </>
  );
}
