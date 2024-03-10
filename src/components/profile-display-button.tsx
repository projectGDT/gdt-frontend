import {Avatar, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import React from "react";
import {Profile} from "@/types";

export default function ProfileDisplayButton({uniqueIdProvider, uniqueId, cachedPlayerName}: Profile) {
    return <ListItemButton>
        {uniqueIdProvider === -1 && <ListItemAvatar>
            <Avatar variant={"square"} src={`https://minotar.net/helm/${uniqueId}`}/>
        </ListItemAvatar>}
        <ListItemText primary={cachedPlayerName} secondary={uniqueId}/>
    </ListItemButton>
}