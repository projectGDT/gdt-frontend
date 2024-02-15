import {Avatar, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import React from "react";

export function JavaMsProfileButton({uuid, playerName}: { uuid: string, playerName: string }) {
    return <ListItemButton>
        <ListItemAvatar>
            <Avatar variant={"square"} src={`https://minotar.net/helm/${uuid}`}/>
        </ListItemAvatar>
        <ListItemText primary={playerName} secondary={uuid}/>
    </ListItemButton>
}