'use client';

import Link from "next/link";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { ConfigurableSidebar } from "@/components/ConfigurableSidebar"; // Подключаем новый компонент
import { signOut } from "next-auth/react";
import { useState } from "react";
import AboutPage from "@/components/AboutModal";

export function Sidebar() {
    const [isModalAboutSystemOpen, setIsModalAboutSystemOpen] = useState(false);
    const headerHeight = process.env.NEXT_PUBLIC_HEADER_HEIGHT;

    return (
        <div
            style={{
                width: 340,
                padding: "1rem",
                borderColor: "#007EC0",
                height: `calc(100vh - ${headerHeight}px)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
            className="px-5 py-5 layout__main flex-1 h-full border border-2 m-0.5 rounded"
        >
            {/* Динамическое меню, в зависимости от текущего пути */}
            <ConfigurableSidebar />

            <Divider sx={{ my: 2 }} />

              {/* Второй список прижат к низу */}
              <List style={{ marginTop: "auto" }}>
                  <ListItemButton
                      component={Link}
                      href="#"
                      onClick={() => setIsModalAboutSystemOpen(true)}
                  >
                      <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="О системе" />
                </ListItemButton>
                {isModalAboutSystemOpen && (
                    <AboutPage
                        isOpen={isModalAboutSystemOpen}
                        setIsOpen={setIsModalAboutSystemOpen}
                    />
                )}

                <ListItemButton
                    component={Link}
                    href="#"
                    onClick={() =>
                        signOut({
                            callbackUrl: "/login",
                        })
                    }
                >
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Выйти" />
                </ListItemButton>
            </List>
        </div>
    );
}
