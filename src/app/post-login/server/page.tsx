"use client"

import {
  Avatar,
    Box, Button, CardContent, Checkbox, Chip, CircularProgress, Divider, FormControlLabel, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography,
    darken,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"
import { BedrockRemote, JavaRemote, PlayerInfo, WholeServer } from "@/types";
import { GET, backendAddress } from "@/utils";
import { ModList } from "@/components/mod-list";
import { MuiMarkdown, getOverrides } from "mui-markdown";
import Image from "next/image";
import {useSearchParams} from "next/navigation";

const ApplyingPolicy = {
    CLOSED: "CLOSED",
    ALL_OPEN: "ALL_OPEN",
    BY_FORM: "BY_FORM"
}

// 页面标题
function ServerHeader(props: {logoLink: string, name: string, id: number, applyingPolicy: string}) {
    const [joinedServers, _setJoinedServers] = useSessionStorage("joinedServers", [-1]);

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Box sx={{display: "flex", justifyContent: "space-between", flexDirection: "row", gap: 2}}>
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar src={props.logoLink} style={{width: 64, height: 64}} variant="rounded"/>
                    </ListItemAvatar>
                    <ListItemText primary={props.name} primaryTypographyProps={{fontSize: 30, fontWeight: "medium", paddingX: 1.5}}/>
                </ListItemButton>

                {joinedServers.includes(props.id) ? 
                    <Box sx={{display: "flex", flexDirection: "row", gap: 2, marginRight: 2}}>
                        <Button size="large" sx={{fontSize: 18}}>{dict.serverid.headerButtons[0]}</Button>
                        <Button size="large" sx={{fontSize: 18}}>{dict.serverid.headerButtons[1]}</Button>
                    </Box> : <Box sx={{display: "flex", flexDirection: "row", gap: 2, marginRight: 2}}>
                        {props.applyingPolicy === ApplyingPolicy.BY_FORM ? 
                            <Button size="large" sx={{fontSize: 18}}>{dict.serverid.headerButtons[2]}</Button> : 
                            (props.applyingPolicy === ApplyingPolicy.ALL_OPEN ? 
                                <Button size="large" sx={{fontSize: 18}}>{dict.serverid.headerButtons[3]}</Button> : 
                                <Button size="large" disabled sx={{fontSize: 18}}>{dict.serverid.headerButtons[3]}</Button>
                            )
                        }
                    </Box>
                }
            </Box>
        </Box>
        
    )
}

// 显示 Java 版本信息时，必须只传 Java；显示基岩版信息时，必须两个都传（不论是否为 undefined）
// 渲染核心版本和兼容版本
function VersionInfo(props: {javaRemote?: JavaRemote, bedrockRemote?: BedrockRemote}) {
    return (
        (!props.bedrockRemote && props.javaRemote) ? <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            {/* 核心版本 */}
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Box sx={{width: "40%", display: "flex", alignItems: "center"}}>
                    <Typography variant="subtitle1">{dict.serverid.cardSubtitle[0]}</Typography>
                </Box>
                <Box sx={{width: "60%", display: "flex"}}>
                    <Typography sx={{fontWeight: "bold"}}>{props.javaRemote.coreVersion}</Typography>
                </Box>
            </Box>

            {/* 兼容版本 */}
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Box sx={{width: "40%", display: "flex", alignItems: "center"}}>
                    <Typography variant="subtitle1">{dict.serverid.cardSubtitle[1]}</Typography>
                </Box>
                <Box sx={{width: "60%", display: "flex"}}>
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                        {props.javaRemote.compatibleVersions.map((item) => <Chip key={item} label={item}/>)}
                    </Box>
                </Box>
            </Box>
        </Box> : props.bedrockRemote && <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            {/* 核心版本 */}
            {!props.javaRemote && <Box sx={{display: "flex", flexDirection: "row"}}>
                <Box sx={{width: "40%", display: "flex", alignItems: "center"}}>
                    <Typography variant="subtitle1">{dict.serverid.cardSubtitle[0]}</Typography>
                </Box>
                <Box sx={{width: "60%", display: "flex"}}>
                    <Typography sx={{fontWeight: "bold"}}>{props.bedrockRemote.coreVersion}</Typography>
                </Box>
            </Box>}

            {/* 兼容版本 */}
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Box sx={{width: "40%", display: "flex", alignItems: "center"}}>
                    <Typography variant="subtitle1">{dict.serverid.cardSubtitle[1]}</Typography>
                </Box>
                <Box sx={{width: "60%", display: "flex"}}>
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                        {props.bedrockRemote.compatibleVersions.map((item) => <Chip key={item} label={item}/>)}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

// authIdx 为 0 是腐竹，1 是 op，2 是普通玩家
function PlayerEntry(props: {player: PlayerInfo, authIdx: number}) {
    const name = props.player.profiles.length === 1 ? props.player.profiles[0].cachedPlayerName :
        (props.player.profiles[0].uniqueIdProvider > props.player.profiles[1].uniqueIdProvider) ? 
        props.player.profiles[0].cachedPlayerName : props.player.profiles[1].cachedPlayerName;
    const uniqueIdProvider = props.player.profiles.length === 1 ? props.player.profiles[0].uniqueIdProvider :
        (props.player.profiles[0].uniqueIdProvider > props.player.profiles[1].uniqueIdProvider) ? 
        props.player.profiles[0].uniqueIdProvider : props.player.profiles[1].uniqueIdProvider;
    const uniqueId = props.player.profiles.length === 1 ? props.player.profiles[0].uniqueId :
        (props.player.profiles[0].uniqueIdProvider > props.player.profiles[1].uniqueIdProvider) ? 
        props.player.profiles[0].uniqueId : props.player.profiles[1].uniqueId;
    return (
        <ListItem disablePadding
            secondaryAction={props.authIdx === 0 ? 
                <Chip label={dict.serverid.authName[0]} color="error"/> :
                props.authIdx === 1 && <Chip label={dict.serverid.authName[1]} color="warning"/>
            }>
            <ListItemButton>
                <ListItemAvatar>
                    {uniqueIdProvider === -1 ? <Avatar variant={"square"} src={`https://minotar.net/helm/${uniqueId}`}/> :
                        <Avatar src={""}/>}
                </ListItemAvatar>
                <ListItemText primary={name}/>
            </ListItemButton>
        </ListItem>
    )
}

export default function Page() {
    const searchParams = useSearchParams()
    const serverId = searchParams.get("id") ?? "-1"

    const [joinedServers, _setJoinedServers] = useSessionStorage<number[]>("joinedServers", []);

    // 整个页面信息 server
    const [server, setServer] = useState<WholeServer>(null!);
    const [refreshing, setRefreshing] = useState(true);

    // 获取 server 信息
    useEffect(() => {
        setRefreshing(true); // 获取信息时候把刷新状态设为 true
        fetch(`${backendAddress}/server-meta/${serverId}`, GET(false))
            .then(response => {
                if (response.ok)
                    return response.json();
                else 
                    throw new Error(`HTTP ERROR, CODE: ${response.status}`);
            })
            .then(data => {
                setServer(data);
            })
            .finally(() => {
                setRefreshing(false); // 最后把刷新状态设为 false
            })
    }, [])

    // 玩家列表 playerInfo
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true);
    const [rawPlayerInfo, setRawPlayerInfo] = useState<PlayerInfo[]>([]);

    // 获取 player 信息
    useEffect(() => {
        setLoadingPlayers(true); // 获取信息时候把刷新状态设为 true
        fetch(`${backendAddress}/post-login/people/server-players/${serverId}`, GET(true))
            .then(response => {
                if (response.ok)
                    return response.json();
                else 
                    throw new Error(`HTTP ERROR, CODE: ${response.status}`);
            })
            .then(data => {
                setRawPlayerInfo(data);
            })
            .finally(() =>{
                setLoadingPlayers(false);
            })
    }, [server])
    
    // 为 player 排序
    useEffect(
        () => {
            if (rawPlayerInfo) {
                const tmpArray = [...rawPlayerInfo];
                tmpArray.sort(
                    (a, b) => {
                    if (a.id === server.ownerId)
                        return -1;
                    if (b.id === server.ownerId)
                        return 1;
                    if (a.isOperator && !b.isOperator) {  
                        return -1; // a排在b前面  
                    }  
                    if (!a.isOperator && b.isOperator) {  
                        return 1; // b排在a前面  
                    }  
                    return 0;  
                    }
                )
                setPlayerInfo(tmpArray);
            }
        }, [rawPlayerInfo]);

    return !refreshing ? (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            {/* 上面的标题 */}
            <Paper>
                <ServerHeader logoLink={server.logoLink} name={server.name} id={parseInt(serverId)} applyingPolicy={server.applyingPolicy}/>
            </Paper>
            
            <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
                {/* 左半边内容 */}
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2, width: "75%"}}>
                        <Paper>
                            <Box sx={{display: "flex", flexDirection: "row"}}>
                                <Box sx={{width: "15%"}}></Box>
                                <Box sx={{width: "70%"}}>
                                    <Box sx={{aspectRatio: 16/9, position: "relative"}}>
                                        <Image src={server.coverLink} alt={"Cover"} fill style={{objectFit: "cover"}}/>
                                    </Box>
                                </Box>
                                <Box sx={{width: "15%"}}></Box>
                            </Box>
                        </Paper>
                        <Paper>
                            <Box sx={{display: "flex", padding: 1}}>
                                <MuiMarkdown
                                    overrides={{
                                        ...getOverrides(),
                                        code: {
                                            props: {
                                                style: {
                                                    fontFamily: '"JetBrains Mono Variable"',
                                                    backgroundColor: darken('#f9f9f9', 0.07),
                                                    borderRadius: '0.25rem',
                                                    padding: '0.25rem, 0.5rem',
                                                },
                                            } as React.HTMLProps<HTMLParagraphElement>,
                                        }
                                    }}>{server.introduction}</MuiMarkdown>
                            </Box>
                        </Paper>
                    </Box>

                {/* 右半边内容 */}
                <Box sx={{display: "flex", width: "25%", flexDirection: "row"}}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2, width: "100%"}}>
                            {/*延迟和在线人数*/}
                            <Paper>
                                <CardContent>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                        <Typography variant="h6">{dict.serverid.cardTitle[0]}</Typography>
                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography sx={{paddingX: 1, fontSize: 18}}>{"0/20"}</Typography>
                                            <Typography sx={{paddingX: 1, fontSize: 18}}>{"50ms"}</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Paper>

                            {/*Java版信息*/}
                            <Paper>
                                <CardContent>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography variant="h6">{dict.serverid.cardTitle[1]}</Typography>
                                            {server.javaRemote ? 
                                                <FormControlLabel 
                                                    control={<Checkbox checked disabled size="small"/>} 
                                                    label={dict.serverid.support[0]} 
                                                    labelPlacement="start"/> :
                                                <FormControlLabel 
                                                    control={<Checkbox disabled size="small"/>} 
                                                    label={dict.serverid.support[1]} 
                                                    labelPlacement="start"/>
                                            }
                                        </Box>

                                        {server.javaRemote && 
                                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                {/* 版本信息 */}
                                                <VersionInfo javaRemote={server.javaRemote}/>
                                                
                                                {/*mod 信息*/}
                                                {server.javaRemote.modpackVersionId &&
                                                    <Box sx={{display: "flex", flexDirection: "column"}}>
                                                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                            <Divider/>
                                                            <Typography variant="h6">{dict.serverid.modTitle[1]}</Typography>
                                                        </Box>
                                                        {/*mod 列表*/}
                                                        <ModList versionId={server.javaRemote.modpackVersionId}/>
                                                    </Box>
                                                }
                                            </Box>
                                        }
                                    </Box>
                                </CardContent>
                            </Paper>

                            {/*基岩版信息*/}
                            <Paper>
                                <CardContent>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography variant="h6">{dict.serverid.cardTitle[2]}</Typography>
                                            {server.bedrockRemote ? 
                                                <FormControlLabel 
                                                    control={<Checkbox checked disabled size="small"/>} 
                                                    label={dict.serverid.support[0]} 
                                                    labelPlacement="start"/> :
                                                <FormControlLabel 
                                                    control={<Checkbox disabled size="small"/>} 
                                                    label={dict.serverid.support[1]} 
                                                    labelPlacement="start"/>
                                            }
                                        </Box>

                                        {server.bedrockRemote && 
                                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                {/* 版本信息 */}
                                                <VersionInfo javaRemote={server.javaRemote} bedrockRemote={server.bedrockRemote}/>
                                            </Box>
                                        }
                                    </Box>
                                </CardContent>
                            </Paper>

                            {/*玩家列表*/}
                            {(
                                <Paper>
                                    <CardContent>
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                            <Typography variant="h6">{dict.serverid.cardTitle[3]}{`${dict.serverid.playerCount(playerInfo.length)}`}</Typography>
                                                {/*玩家列表*/}
                                                {joinedServers.includes(server.id) ? 
                                                    (!loadingPlayers ? <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                        {playerInfo.map(
                                                            (item, idx) => <PlayerEntry player={item} authIdx={idx === 0 ? 0 : item.isOperator ? 1 : 2} key={idx}/>
                                                        )}
                                                    </Box> : <Box sx={{display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}><CircularProgress/></Box>) :
                                                    <Box>
                                                        {/*提示信息*/}
                                                        <Typography variant="body2" color="GrayText" marginLeft={1}>{`${server.applyingPolicy === ApplyingPolicy.BY_FORM ? dict.serverid.accessPrompt[1] : dict.serverid.accessPrompt[2]}${dict.serverid.accessPrompt[3]}`}</Typography>
                                                    </Box>
                                                }
                                        </Box>
                                    </CardContent>
                                </Paper>
                            )}
                        </Box>
                </Box>
            </Box>
        </Box>
    ) : <Box sx={{display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}><CircularProgress/></Box>
}