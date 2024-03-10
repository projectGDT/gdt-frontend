"use client"

import {
    Box,
    Button,
    Divider,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Paper,
    Skeleton,
    Typography
} from "@mui/material";
import {dict} from "@/i18n/zh-cn";
import React, {useEffect, useState} from "react";
import {backendAddress, GET, POST} from "@/utils";
import {DeleteOutlineOutlined} from "@mui/icons-material";
import ProfileDisplayButton from "@/components/profile-display-button";
import {useConfirm} from "material-ui-confirm";

type Profile = {
    uniqueIdProvider: number,
    uniqueId: string,
    cachedPlayerName: string
}

const xboxOauthUri = "https://login.live.com/oauth20_authorize.srf?client_id=9e474b67-edcd-4d23-b2fc-6dc8db5e08f7&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fpost-login%2Fsettings%2Fprofile%2Fxbox&response_type=code&scope=XboxLive.signin"

export default function Page() {
    const confirm = useConfirm()

    const [loading, setLoading] = useState(true)
    const [javaMsProfile, setJavaMsProfile] = useState<Profile>()
    const [xboxProfile, setXboxProfile] = useState<Profile>()
    const [offlineProfiles, setOfflineProfiles] = useState<Profile[]>([])

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

    return <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
        <Box sx={{textAlign: "center"}}>
            <Typography variant={"h5"}>{dict.settings.profile.title}</Typography>
        </Box>
        <Paper><List>
            {loading ? <>
                <Skeleton width={"100%"} height={100}/>
                <Skeleton width={"100%"} height={100}/>
                <Skeleton width={"100%"} height={100}/>
            </> : <>
                <ListSubheader>{dict.settings.profile.javaMicrosoft.title}</ListSubheader>
                {javaMsProfile ? (
                    <ListItem
                        disablePadding
                        key={javaMsProfile.uniqueIdProvider}
                        secondaryAction={<IconButton onClick={() => confirm({
                            description: dict.settings.profile.onDelete,
                        }).then(() => {
                            setLoading(true) // 因为内容发生改变，所以先“掩人耳目”
                            fetch(`${backendAddress}/post-login/profile/delete`, POST({
                                uniqueIdProvider: -1
                            })).then(_response => setUserModifyFlag(prev => prev + 1))
                            // 这会让 useEffect 重新执行一遍
                        })}
                    >
                        <DeleteOutlineOutlined/>
                    </IconButton>}>
                        <ProfileDisplayButton {...javaMsProfile}/>
                    </ListItem>
                ) : (
                    <ListItem secondaryAction={<Button href={"profile/java-microsoft"}>
                        {dict.settings.profile.doBind}
                    </Button>}>
                        <ListItemText secondary={dict.settings.profile.javaMicrosoft.fallback}/>
                    </ListItem>
                )}

                <Divider/>

                <ListSubheader>{dict.settings.profile.xbox.title}</ListSubheader>
                {xboxProfile ? (
                    <ListItem
                        disablePadding
                        key={xboxProfile.uniqueIdProvider}
                        secondaryAction={<IconButton onClick={() => confirm({
                            description: dict.settings.profile.onDelete,
                        }).then(() => {
                            setLoading(true)
                            fetch(`${backendAddress}/post-login/profile/delete`, POST({
                                uniqueIdProvider: -3
                            })).then(_response => setUserModifyFlag(prev => prev + 1))
                        })}
                    >
                        <DeleteOutlineOutlined/>
                    </IconButton>}>
                        <ProfileDisplayButton {...xboxProfile}/>
                    </ListItem>
                ) : (
                    <ListItem disablePadding secondaryAction={<Button
                        onClick={() => confirm({
                            description: dict.settings.profile.xbox.onClick,
                            confirmationButtonProps: {
                                href: xboxOauthUri
                            }
                        })}
                    >{dict.settings.profile.doBind}</Button>}>
                        <ListItemButton>
                            <ListItemText secondary={dict.settings.profile.xbox.fallback}/>
                        </ListItemButton>
                    </ListItem>
                )}

                <Divider/>

                <ListSubheader>{dict.settings.profile.offline.title}</ListSubheader>
                <ListItem><ListItemText secondary={dict.settings.profile.offline.fallback}/></ListItem>
                {offlineProfiles.map(profile => <ListItem disablePadding key={profile.uniqueIdProvider}>
                    <ListItemButton href={`/server/${profile.uniqueIdProvider}`}>
                        <ListItemText primary={`${profile.uniqueId}`}
                                      secondary={dict.settings.profile.offline.secondary(profile.uniqueIdProvider)}/>
                    </ListItemButton>
                </ListItem>)}

                <Divider/>

                <ListItem>
                    <ListItemText>
                        <Typography variant={"caption"}>
                            Minecraft Head API provided by <Link href="https://minotar.net/">minotar.net</Link>
                        </Typography>
                    </ListItemText>
                </ListItem>
            </>}
        </List></Paper>
    </Box>
}