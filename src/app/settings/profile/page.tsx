"use client"

import {
    Avatar,
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Divider, IconButton,
    Link,
    List,
    ListItem, ListItemAvatar,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Skeleton,
    Typography
} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import React, {useEffect, useState} from "react";
import {backendAddress, GET, POST} from "@/utils";
import {DeleteOutlineOutlined} from "@mui/icons-material";

type Profile = {
    uniqueIdProvider: number,
    uniqueId: string,
    cachedPlayerName: string
}

const xboxOauthUri = "https://login.live.com/oauth20_authorize.srf?client_id=9e474b67-edcd-4d23-b2fc-6dc8db5e08f7&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsettings%2Fprofile%2Fxbox&response_type=code&scope=XboxLive.signin"

export default function Page() {
    const [loading, setLoading] = useState(true)
    const [javaMsProfile, setJavaMsProfile] = useState<Profile>()
    const [xboxProfile, setXboxProfile] = useState<Profile>()
    const [offlineProfiles, setOfflineProfiles] = useState<Profile[]>([])

    const [javaDeleteOpen, setJavaDeleteOpen] = useState(false)
    const [xboxDeleteOpen, setXboxDeleteOpen] = useState(false)

    const [userModifyFlag, setUserModifyFlag] = useState(0)

    useEffect(() => {
        fetch(`${backendAddress}/post-login/profile/fetch`, GET()).then(res => res.json()).then((body: Profile[]) => {
            body.filter(entry => entry.uniqueIdProvider === -1).forEach(setJavaMsProfile) // 最多执行 1 次
            body.filter(entry => entry.uniqueIdProvider === -3).forEach(setXboxProfile) // 最多执行 1 次
            setOfflineProfiles(body.filter(entry => entry.uniqueIdProvider > 0))
            setLoading(false)
        })
        return () => {
            setJavaMsProfile(undefined)
            setXboxProfile(undefined)
        }
    }, [userModifyFlag])

    return <List>
        <Box sx={{
            height: 100
        }}></Box>
        <Box sx={{textAlign: "center"}}>
            <Typography variant={"h5"}>{dict.settings.profile.title}</Typography>
            <Typography variant={"caption"}>{dict.settings.profile.secondary}</Typography>
        </Box>
        {loading ? <>
            <Skeleton width={"100%"} height={100}/>
            <Skeleton width={"100%"} height={100}/>
            <Skeleton width={"100%"} height={100}/>
        </> : <>
            <ListSubheader disableGutters>{dict.settings.profile.javaMicrosoft.title}</ListSubheader>
            {javaMsProfile ? (
                <ListItem disablePadding
                          key={javaMsProfile.uniqueIdProvider}
                          secondaryAction={<IconButton onClick={() => setJavaDeleteOpen(true)}>
                              <DeleteOutlineOutlined/>
                          </IconButton>}>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar variant={"square"} src={`https://minotar.net/helm/${javaMsProfile.uniqueId}`}/>
                        </ListItemAvatar>
                        <ListItemText primary={javaMsProfile.cachedPlayerName} secondary={javaMsProfile.uniqueId}/>
                    </ListItemButton>
                </ListItem>
            ) : (
                <ListItem disablePadding secondaryAction={<Button href={"profile/java-microsoft"}>
                    {dict.settings.profile.doBind}
                </Button>}>
                    <ListItemButton>
                        <ListItemText secondary={dict.settings.profile.javaMicrosoft.fallback}/>
                    </ListItemButton>
                </ListItem>
            )}
            <Dialog open={javaDeleteOpen} onClose={() => setJavaDeleteOpen(false)}>
                <DialogContent>
                    <DialogContentText>{dict.settings.profile.onDelete.content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setJavaDeleteOpen(false)}>{dict.settings.profile.onDelete.cancel}</Button>
                    <Button onClick={() => {
                        setLoading(true) // 因为内容发生改变，所以先“掩人耳目”
                        setJavaDeleteOpen(false)
                        fetch(`${backendAddress}/post-login/profile/delete`, POST({
                            uniqueIdProvider: -1
                        })).then(_response => setUserModifyFlag(prev => prev + 1))
                        // 这会让 useEffect 重新执行一遍
                    }}>{dict.settings.profile.onDelete.confirm}</Button>
                </DialogActions>
            </Dialog>

            <Divider/>

            <ListSubheader disableGutters>{dict.settings.profile.xbox.title}</ListSubheader>
            {xboxProfile ? (
                <ListItem disablePadding
                          key={xboxProfile.uniqueIdProvider}
                          secondaryAction={<IconButton onClick={() => setXboxDeleteOpen(true)}>
                              <DeleteOutlineOutlined/>
                          </IconButton>}>
                    <ListItemButton>
                        <ListItemText primary={xboxProfile.cachedPlayerName} secondary={xboxProfile.uniqueId}/>
                    </ListItemButton>
                </ListItem>
            ) : (
                <ListItem disablePadding secondaryAction={<Button
                    href={xboxOauthUri}
                >{dict.settings.profile.doBind}</Button>}>
                    <ListItemButton>
                        <ListItemText secondary={dict.settings.profile.xbox.fallback}/>
                    </ListItemButton>
                </ListItem>
            )}
            <Dialog open={xboxDeleteOpen} onClose={() => setXboxDeleteOpen(false)}>
                <DialogContent>
                    <DialogContentText>{dict.settings.profile.onDelete.content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setXboxDeleteOpen(false)}>{dict.settings.profile.onDelete.cancel}</Button>
                    <Button onClick={() => {
                        setLoading(true)
                        setXboxDeleteOpen(false)
                        fetch(`${backendAddress}/post-login/profile/delete`, POST({
                            uniqueIdProvider: -3
                        })).then(_response => setUserModifyFlag(prev => prev + 1))
                    }}>{dict.settings.profile.onDelete.confirm}</Button>
                </DialogActions>
            </Dialog>

            <Divider/>

            <ListSubheader disableGutters>{dict.settings.profile.offline.title}</ListSubheader>
            <ListItem><ListItemText secondary={dict.settings.profile.offline.fallback}/></ListItem>
            {offlineProfiles.map(profile => <ListItem disablePadding key={profile.uniqueIdProvider}>
                <ListItemButton href={`/server/${profile.uniqueIdProvider}`}>
                    <ListItemText primary={`${profile.uniqueId}`}
                                  secondary={dict.settings.profile.offline.secondary(profile.uniqueIdProvider)}/>
                </ListItemButton>
            </ListItem>)}

            <ListItemText>
                <Typography variant={"caption"}>
                    Minecraft Head API provided by <Link href="https://minotar.net/">minotar.net</Link>
                </Typography>
            </ListItemText>
        </>}
    </List>
}