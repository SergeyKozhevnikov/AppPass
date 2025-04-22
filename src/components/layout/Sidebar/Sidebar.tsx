'use client';

import Link from "next/link";
import Image from "next/image";
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

export function Sidebar() {
    const headerHeight = process.env.NEXT_PUBLIC_HEADER_HEIGHT;

    return (
        <div
            style={{
                width: 340,
                padding: "1rem",
                borderColor: "#007EC0",
                height: `calc(100vh - ${headerHeight}px)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
            className="px-5 py-5 layout__main flex-1 h-full border border-2 m-0.5 rounded"
        >
            {/* Динамическое меню, в зависимости от текущего пути */}
            <ConfigurableSidebar />

            <Divider sx={{ my: 2 }} />

            {/* Первый список: Настройки и О программе */}
            <nav>
                <ul>
                    <li>
                        <Link className="flex items-center mb-5" href="/my-requests" title="Мои заявки">
                            <Image className="mr-1" src="/assets/images/first-level-settings.svg" alt="item" width={40} height={40} />
                            Настройки
                        </Link>
                    </li>
                    <li>
                        <Link className="flex items-center mb-5" href="/about" title="О программе">
                            <Image className="mr-1" src="/assets/images/about.svg" alt="item" width={40} height={40} />
                            О программе
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Второй список прижат к низу */}
            <List style={{ marginTop: 'auto' }}>
                <ListItemButton component={Link} href="/about">
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="О системе" />
                </ListItemButton>

                <ListItemButton component={Link} href="/logout">
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Выйти" />
                </ListItemButton>
            </List>
        </div>
    );
}