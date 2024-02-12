"use client"

import {Box, Typography} from "@mui/material";
import React from "react";
import {dict} from "@/i18n/zh-cn";

export default function RegisterLayout({children}: { children: React.ReactNode }) {
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        paddingX: "30%",
        flexGrow: 1
    }}>
        <Box sx={{display: "flex", alignItems: "center", flexGrow: 1}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2, flexGrow: 1}}>
                <Box sx={{textAlign: "center", padding: 2}}>
                    <Typography variant={"h5"}>{dict.register.title}</Typography>
                </Box>
                {children}
            </Box>
        </Box>
    </Box>
}