import { Box } from "@mui/material";
import React from "react";

export default function LoginLayout({children}: { children: React.ReactNode }) {
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
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