"use client"

import {List, ListItemButton, ListItemText} from "@mui/material";
import React from "react";
import {dict} from "@/i18n/zh-cn";
import {useRouter} from "next/navigation";

const settingNavigation = [
    {
        href: "/settings/profile",
        display: {
            primary: dict.settings.profile.title,
            secondary: dict.settings.profile.secondary
        }
    }
]

export default function Page() {
    const router = useRouter()

    return <List>
        {settingNavigation.map(entry => (
            <ListItemButton key={entry.href} onClick={() => router.push(entry.href)}><ListItemText
                primary={entry.display.primary}
                secondary={entry.display.secondary}
            /></ListItemButton>
        ))}
    </List>
}