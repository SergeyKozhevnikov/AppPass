"use client"

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

  return (
    <div className="flex flex-col min-h-screen h-screen">
      <Header />

      {/* Кнопка меню только для mobile */}
      <div className="md:hidden px-4 pt-2">
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      </div>

      <div className="layout__wrapper flex flex-1 min-h-screen h-full">
        {/* Боковая панель для desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* MUI Drawer для mobile */}
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
          <Sidebar />
        </Drawer>

        <main
          style={{ borderColor: "#007EC0" }}
          className="px-5 py-5 layout__main flex-1 min-h-screen h-full border border-2 m-0.5 rounded"
        >
          {children}
        </main>
      </div>
    </div>
  );
}