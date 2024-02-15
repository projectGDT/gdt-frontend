import {ListItemButton, ListItemText} from "@mui/material";
import React from "react";

export function XboxProfileButton({xuid, gtg}: { xuid: string, gtg: string }) {
    return <ListItemButton>
        <ListItemText primary={gtg} secondary={xuid}/>
    </ListItemButton>
}