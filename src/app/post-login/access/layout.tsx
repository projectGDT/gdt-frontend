"use client"

import { Box } from "@mui/material";
import React from "react";

export default function AccessLayout({children}: { children: React.ReactNode }) {
    return <Box sx={{
        display: "flex",
        alignItems: "center",
        flexGrow: 1
    }}>
        <Box sx={{flexGrow: 1}}>
            {children}
        </Box>
    </Box>
}