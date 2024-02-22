"use client"

import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"
import { BedrockRemote, JavaRemote, PlayerInfo, WholeServer } from "@/types";
import { GET, backendAddress } from "@/utils";
import ModList from "@/components/mod-list";
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import MarkdownCustom from "@/components/markdown-custom";

const ApplyingPolicy = {
    CLOSED: "CLOSED",
    ALL_OPEN: "ALL_OPEN",
    BY_FORM: "BY_FORM"
}

// 页面标题
function ServerHeader(props: {logoLink: string, name: string, id: number, applyingPolicy: string}) {
    const [joinedServers, _setJoinedServers] = useSessionStorage("joinedServers", [-1]);

    return <ListItem disablePadding secondaryAction={joinedServers.includes(props.id) ?
        <Box sx={{display: "flex", flexDirection: "row", gap: 2, marginRight: 2}}>
            <Button variant={"contained"} sx={{fontSize: 16}}>{dict.server.headerButtons[0]}</Button>
            <Button sx={{fontSize: 16}}>{dict.server.headerButtons[1]}</Button>
        </Box> : <Box sx={{display: "flex", flexDirection: "row", gap: 2, marginRight: 2}}>
            {props.applyingPolicy === ApplyingPolicy.BY_FORM ?
                <Button  sx={{fontSize: 16}}>{dict.server.headerButtons[2]}</Button> :
                (props.applyingPolicy === ApplyingPolicy.ALL_OPEN || props.applyingPolicy === ApplyingPolicy.BY_FORM ?
                        <Button variant={"contained"} sx={{fontSize: 16}}>{dict.server.headerButtons[3]}</Button> :
                        <Button disabled sx={{fontSize: 16}}>{dict.server.headerButtons[3]}</Button>
                )
            }
        </Box>
    }>
        <ListItemButton>
            <ListItemAvatar>
                <Avatar src={props.logoLink} style={{width: 64, height: 64}} variant="rounded"/>
            </ListItemAvatar>
            <ListItemText primary={props.name} primaryTypographyProps={{fontSize: 24, fontWeight: "medium", paddingX: 1.5}}/>
        </ListItemButton>
    </ListItem>
}

// 显示 Java 版本信息时，必须只传 Java；显示基岩版信息时，必须两个都传（不论是否为 undefined）
// 渲染核心版本和兼容版本
function VersionInfo(props: {javaRemote?: JavaRemote, bedrockRemote?: BedrockRemote}) {
    return (
        (!props.bedrockRemote && props.javaRemote) ? <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            {/* 核心版本 */}
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "baseline"}}>
                <Box sx={{width: "40%"}}>
                    <Typography variant="subtitle1">{dict.server.cardSubtitle[0]}</Typography>
                </Box>
                <Box sx={{width: "60%"}}>
                    <Typography sx={{fontWeight: "bold"}}>{props.javaRemote.coreVersion}</Typography>
                </Box>
            </Box>

            {/* 兼容版本 */}
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "baseline"}}>
                <Box sx={{width: "40%"}}>
                    <Typography variant="subtitle1">{dict.server.cardSubtitle[1]}</Typography>
                </Box>
                <Box sx={{width: "60%", display: "flex", flexWrap: "wrap", gap: 0.5}}>
                    {props.javaRemote.compatibleVersions.map((item) => <Chip key={item} label={item}/>)}
                </Box>
            </Box>
        </Box> : props.bedrockRemote && <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
            {/* 核心版本 */}
            {!props.javaRemote && <Box sx={{display: "flex", flexDirection: "row", alignItems: "baseline"}}>
                <Box sx={{width: "40%"}}>
                    <Typography variant="subtitle1">{dict.server.cardSubtitle[0]}</Typography>
                </Box>
                <Box sx={{width: "60%"}}>
                    <Typography sx={{fontWeight: "bold"}}>{props.bedrockRemote.coreVersion}</Typography>
                </Box>
            </Box>}

            {/* 兼容版本 */}
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "baseline"}}>
                <Box sx={{width: "40%"}}>
                    <Typography variant="subtitle1">{dict.server.cardSubtitle[1]}</Typography>
                </Box>
                <Box sx={{width: "60%", display: "flex", flexWrap: "wrap", gap: 0.5}}>
                    {props.bedrockRemote.compatibleVersions.map((item) => <Chip key={item} label={item}/>)}
                </Box>
            </Box>
        </Box>
    )
}

// authIdx 为 0 是腐竹，1 是 op，2 是普通玩家
function PlayerEntry({player: {id, profiles, isOperator}, index}: {player: PlayerInfo, index: number}) {
    const {uniqueIdProvider, uniqueId, cachedPlayerName} = profiles.length > 1 ? (
        profiles[0].uniqueIdProvider > profiles[1].uniqueIdProvider ? profiles[0] : profiles[1]
    ) : profiles[0]

    return (
        <ListItem
            disablePadding
            secondaryAction={index === 0 ?
                <Chip label={dict.server.authName[0]} color="error"/> :
                index === 1 && <Chip label={dict.server.authName[1]} color="warning"/>
            }
        >
            <ListItemButton>
                <ListItemAvatar>
                    {uniqueIdProvider === -1 ? <Avatar variant={"square"} src={`https://minotar.net/helm/${uniqueId}`}/> :
                        <Avatar src={""}/>}
                </ListItemAvatar>
                <ListItemText primary={cachedPlayerName} secondary={uniqueIdProvider > 0 ? uniqueId : ""}/>
            </ListItemButton>
        </ListItem>
    )
}

function PlayerList({server: {id, ownerId}}: {server: WholeServer}) {
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true);

    useEffect(() => {
        setLoadingPlayers(true); // 获取信息时候把刷新状态设为 true
        fetch(`${backendAddress}/post-login/people/server-players/${id}`, GET())
            .then(response => response.json())
            .then(data => (data as PlayerInfo[]).toSorted((a, b) => {
                if (a.id === ownerId)
                    return -1;
                if (b.id === ownerId)
                    return 1;
                if (a.isOperator && !b.isOperator) {
                    return -1; // a排在b前面
                }
                if (!a.isOperator && b.isOperator) {
                    return 1; // b排在a前面
                }
                return 0;
            }))
            .then(info => {
                console.log(info)
                setPlayerInfo(info)
            })
            .finally(() => {
                setLoadingPlayers(false);
            })
    }, [])

    return <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
        <Typography variant={"h6"} sx={{paddingX: 2, paddingTop: 2}}>
            {dict.server.cardTitle[3]}{`${dict.server.playerCount(playerInfo.length)}`}
        </Typography>
        <Divider/>
        {/*玩家列表*/}
        {!loadingPlayers ?
            <List disablePadding>
                {playerInfo.map(
                    (item, idx) =>
                        <PlayerEntry
                            player={item}
                            index={idx === 0 ? 0 : item.isOperator ? 1 : 2}
                            key={idx}
                        />
                )}
            </List> :
            <Box sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}><CircularProgress/></Box>}
    </Box>
}

function ServerInfo({server}: {server: WholeServer}) {
    const [joinedServers, _setJoinedServers] = useSessionStorage("joinedServers", [-1]);

    return <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
        {/* 上面的标题 */}
        <Paper>
            <ServerHeader logoLink={server.logoLink} name={server.name} id={server.id} applyingPolicy={server.applyingPolicy}/>
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
                        <MarkdownCustom>{server.introduction}</MarkdownCustom>
                    </Box>
                </Paper>
            </Box>

            {/* 右半边内容 */}
            <Box sx={{display: "flex", width: "25%", flexDirection: "row"}}>
                <Box sx={{display: "flex", flexDirection: "column", gap: 2, width: "100%"}}>
                    {/*延迟和在线人数*/}
                    <Paper>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                            <Typography variant="h6" sx={{paddingX: 2, paddingTop: 2}}>{dict.server.cardTitle[0]}</Typography>
                            <Divider/>
                            <Box sx={{display: "flex", justifyContent: "space-between", paddingX: 2, paddingBottom: 2}}>
                                <Typography sx={{paddingX: 1, fontSize: 18}}>{"0/20"}</Typography>
                                <Typography sx={{paddingX: 1, fontSize: 18}}>{"50ms"}</Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/*Java版信息*/}
                    <Paper>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                            <Box sx={{display: "flex", justifyContent: "space-between", paddingX: 2, paddingTop: 2}}>
                                <Typography variant="h6">{dict.server.cardTitle[1]}</Typography>
                                {server.javaRemote ?
                                    <FormControlLabel
                                        control={<Checkbox checked disabled size="small"/>}
                                        label={dict.server.support[0]}
                                        labelPlacement="start"/> :
                                    <FormControlLabel
                                        control={<Checkbox disabled size="small"/>}
                                        label={dict.server.support[1]}
                                        labelPlacement="start"/>
                                }
                            </Box>
                            <Divider/>
                            {server.javaRemote &&
                                <Box sx={{display: "flex", flexDirection: "column", gap: 2, paddingX: 2, paddingBottom: 2}}>
                                    {/* 版本信息 */}
                                    <VersionInfo javaRemote={server.javaRemote}/>

                                    {/* mod 信息 */}
                                    {server.javaRemote.modpackVersionId && <Box sx={{display: "flex", flexDirection: "column"}}>
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                            <Divider/>
                                            <Typography variant="h6">{dict.server.modTitle[1]}</Typography>
                                        </Box>
                                        {/* mod 列表 */}
                                        <ModList versionId={server.javaRemote.modpackVersionId}/>
                                    </Box>}
                                </Box>
                            }
                        </Box>
                    </Paper>

                    {/* 基岩版信息 */}
                    <Paper>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingX: 2, paddingTop: 2}}>
                                <Typography variant="h6">{dict.server.cardTitle[2]}</Typography>
                                {server.bedrockRemote ?
                                    <FormControlLabel
                                        control={<Checkbox checked disabled size="small"/>}
                                        label={dict.server.support[0]}
                                        labelPlacement="start"/> :
                                    <FormControlLabel
                                        control={<Checkbox disabled size="small"/>}
                                        label={dict.server.support[1]}
                                        labelPlacement="start"/>
                                }
                            </Box>
                            <Divider/>
                            {server.bedrockRemote &&
                                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                    {/* 版本信息 */}
                                    <VersionInfo javaRemote={server.javaRemote} bedrockRemote={server.bedrockRemote}/>
                                </Box>
                            }
                        </Box>
                    </Paper>

                    {/*玩家列表*/}
                    <Paper>
                        {joinedServers.includes(server.id) ?
                            <PlayerList server={server}/> :
                            <Typography variant="body2" color="GrayText" marginLeft={1}>
                                {`${server.applyingPolicy === ApplyingPolicy.BY_FORM ? dict.server.accessPrompt[1] : dict.server.accessPrompt[2]}${dict.server.accessPrompt[3]}`}
                            </Typography>
                        }
                    </Paper>
                </Box>
            </Box>
        </Box>
    </Box>
}

export default function Page() {
    const searchParams = useSearchParams()
    const serverId = searchParams.get("id")!
    const [server, setServer] = useState<WholeServer>();

    // 获取 server 信息
    useEffect(() => {
        fetch(`${backendAddress}/server-meta/${serverId}`, GET(false))
            .then(response => response.json())
            .then(data => {
                setServer(data)
            })
    }, [serverId])

    return server ?
        <ServerInfo server={server}/>:
        <Box sx={{display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}><CircularProgress/></Box>
}