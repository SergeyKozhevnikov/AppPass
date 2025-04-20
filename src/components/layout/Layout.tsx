'use client';

import { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Layout.css";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const headerHeight = process.env.NEXT_PUBLIC_HEADER_HEIGHT;

  return (
    <div className="flex flex-col h-screen">
      {/* HEADER фиксированной высоты */}
      <div>
        <Header />
      </div>

      {/* Кнопка меню только для mobile */}
      <div className="md:hidden px-4 pt-2">
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* Основная обёртка контента */}
      <div className="layout__wrapper flex flex-1 min-h-0">
        {/* Sidebar для десктопа */}
        <div className="hidden md:block" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
          <Sidebar />
        </div>

        {/* Sidebar как Drawer для мобилок */}
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
          <Sidebar />
        </Drawer>

        {/* Контентная часть */}
        <main
          style={{
            borderColor: "#007EC0",
            height: `calc(100vh - ${headerHeight}px)`,
          }}
          className="px-5 py-5 layout__main flex-1 border border-2 m-0.5 rounded overflow-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
}