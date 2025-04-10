import "./Layout.css";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  const showSidebar: boolean = true;

  return (
    <div className="flex flex-col min-h-screen h-screen">
      <Header />
      <div className="layout__wrapper flex flex-1 min-h-screen h-full">
        {showSidebar && <Sidebar />}
        <main className="layout__main flex-1 min-h-screen h-full">{children}</main>
      </div>
    </div>
  );
}