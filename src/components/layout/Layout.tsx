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
        <main style={{ borderColor: "#007EC0" }} className="px-5 py-5 layout__main flex-1 min-h-screen h-full border border-2 m-0.5 rounded">{children}</main>
      </div>
    </div>
  );
}