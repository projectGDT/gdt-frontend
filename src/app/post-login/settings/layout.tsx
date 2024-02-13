"use client"

import { Box } from "@mui/material";
import React from "react";

export default function SettingsLayout({children}: { children: React.ReactNode }) {
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        paddingX: "20%",
        flexGrow: 1
    }}>
        <Box sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1
        }}>
            <Box sx={{flexGrow: 1}}>
                {children}
            </Box>
        </Box>
    </Box>
}