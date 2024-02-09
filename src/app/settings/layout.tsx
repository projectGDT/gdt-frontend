"use client"

import { Box } from "@mui/material";
import React from "react";

export default function SettingsLayout({children}: { children: React.ReactNode }) {
    return <Box sx={{display: "flex", flexDirection: "column", alignItems: "stretch", paddingX: "20%"}}>
        {children}
    </Box>
}