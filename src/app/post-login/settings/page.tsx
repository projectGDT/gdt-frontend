"use client"

import {Box, List, ListItemButton, ListItemText, Paper, Skeleton, Typography} from "@mui/material";
import React from "react";
import {dict} from "@/i18n/zh-cn";

const settingNavigation = [
    {
        href: "settings/profile",
        display: {
            primary: dict.settings.profile.title,
            secondary: dict.settings.profile.secondary
        }
    }
]

export default function Page() {
    return <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
        <Box sx={{textAlign: "center"}}>
            <Typography variant={"h5"}>{dict.settings.title}</Typography>
        </Box>
        <Paper><List>
            {settingNavigation.map(entry => (
                <ListItemButton key={entry.href} href={entry.href}>
                    <ListItemText primary={entry.display.primary}
                                  secondary={entry.display.secondary}/>
                </ListItemButton>
            ))}
        </List></Paper>
    </Box>
}