"use client"

import {
    Alert,
    Box,
    Button, Card, CardMedia, Collapse,
    Container,
    Divider,
    Grid,
    Link,
    List,
    ListItem,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useId, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"

// @/templates 定义了一些常量和模板
import Script from "next/script";
import { Image } from "@mui/icons-material";
import { space } from "postcss/lib/list";

import mc, { NewPingResult, OldPingResult } from 'minecraft-protocol';
import { Router, useSearchParams } from "react-router-dom";

// 定义一种错误, 和网络错误区分开, 后面会有用
class IncorrectCredentialsError extends Error {
    constructor(props?: string | undefined) {
        super(props || undefined);
    }
}

const TESTITEMS = [
    {
        server: {
            id: 1,
            name: "TimelessMC",
            logoLink: "http://dummyimage.com/128x128",
            javaRemote: {
                address: "mc4.rhymc.com",
                port: 10155
            }
        },
        isOperator: true
    },
    {
        server: {
            id: 2,
            name: "TimelessMC",
            logoLink: "http://dummyimage.com/128x128",
            javaRemote: {
                address: "mc4.rhymc.com",
                port: 10155
            }
        },
        isOperator: false
    }
]
const TESTFINDS = {
    servers: [
        {
            id: 3,
            name: "string",
            logoLink: "http://dummyimage.com/128x128",
            coverLink: "http://dummyimage.com/1280x720",
            javaRemote: {
                address: "mc4.rhymc.com",
                port: 10155
            },
            bedrockRemote: {
              address: "string",
              port: 0
            },
            applyingPolicy: "CLOSED"
        },
        {
            id: 4,
            name: "string",
            logoLink: "http://dummyimage.com/128x128",
            coverLink: "http://dummyimage.com/1280x720",
            javaRemote: {
                address: "mc4.rhymc.com",
                port: 10155
            },
            bedrockRemote: {
              address: "string",
              port: 0
            },
            applyingPolicy: "CLOSED"
        },
        {
            id: 5,
            name: "string",
            logoLink: "http://dummyimage.com/128x128",
            coverLink: "http://dummyimage.com/1280x720",
            javaRemote: {
                address: "mc4.rhymc.com",
                port: 10155
            },
            bedrockRemote: {
              address: "string",
              port: 0
            },
            applyingPolicy: "CLOSED"
        }
    ],
    hasNextPage: false
}

class ServerPingInfo {
    isJavaEdition: boolean = true;
    online: number = 0;
    max: number = 0;
    latency: number = 0;
}

// 每个卡片上的服务器图标和名称
function ServerName(props: {logolink: string, name: string, id: number}) {
    return (
        <Box sx={{paddingX: 1.5, paddingY: 1}}>
            <Box sx={{display: "flex", height: "auto"}}>
                <img src={props.logolink} style={{width: 64, height: 64}}/>
                {/*<Box sx={{display: "flex", alignItems: "center", paddingX: 1, fontSize: 23}}>{props.name}</Box>*/}
                <Link href={`/server/${props.id}`} color="inherit" underline="none" sx={{display: "flex", alignItems: "center", paddingX: 1, fontSize: 23}}>{props.name}</Link>
            </Box>
        </Box>
    )
}

// 每个卡片下面的按钮
function CardButtons(props: {id: number, isOp: boolean}) {
    const router = useRouter()
    return (
        <Stack direction="row-reverse" paddingX={1.5} paddingY={1}>
            <Button variant="text" size="small">{dict.list.cardButtons[0]}</Button>
            {props.isOp && <Button variant="text" size="small" onClick={() => router.replace(`/server/${props.id}/manage`)}>{dict.list.cardButtons[1]}</Button>}
        </Stack>
    )
}

// 这一块的内容会套在 /src/app/layout.jsx 定义的东西里面
export default function Page() {
    const router = useRouter()
    const formRef = useRef()

    // React 中的 State, 一种可以在多次渲染之间暂存的变量, 详见文档
    const [incorrectCredentialsOpen, setIncorrectCredentialsOpen] = useState(false)
    const [networkErrorOpen, setNetworkErrorOpen] = useState(false)

    const [id, setId] = useSessionStorage("id", -1)
    const [isSiteAdmin, setIsSiteAdmin] = useSessionStorage("isSiteAdmin", false)
    const [jwt, setJWT] = useSessionStorage("jwt", "")
/*
    let pingInfo: ServerPingInfo[];
    let cnt: number = 0;

    useEffect(() => {
        // 先GET加入服务器和 发现服务器列表，然后对加入服务器中的每一个执行一次ping
        TESTITEMS.forEach(element => {
            if (element.server.javaRemote !== null) {
                const pingOption: mc.PingOptions = {
                    host: element.server.javaRemote.address,
                    port: element.server.javaRemote.port
                }
                mc.ping(pingOption, (err, pingResults) => {
                    if (err) console.error('ERROR: ${err.message}');
                    let result = pingResults as NewPingResult;
                    pingInfo[cnt].isJavaEdition = true;
                    pingInfo[cnt].online = result.players.online;
                    pingInfo[cnt].max = result.players.max;
                    pingInfo[cnt].latency = result.latency;
                    cnt += 1;
                });
            }
            else {
                pingInfo[cnt].isJavaEdition = false;
                cnt += 1;
            }
        });
    }, [])

    let rendercnt: number = -1;
*/
    return (
        // 一个 Box 放下两栏：“我加入的”和“推荐”
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Box sx={{display: "flex", flexDirection: "column", height: "40vh"}}>
                <Box sx={{fontSize: 30}}>{dict.list.subtitle[0]}</Box>
                <Box paddingY={1}>
                    <Grid container spacing={2}>
                        {TESTITEMS.map(({server, isOperator}) =>{
                            //rendercnt += 1;

                            return (<Grid item xs={3} key={server.id}>
                                <Paper elevation={3}>
                                    <ServerName logolink={server.logoLink} name={server.name} id={server.id}/>
                                    <Divider variant="middle"/>
                                    <Box sx={{display: "flex", flexDirection: "row", height: "8vh", paddingX: 2, paddingY: 1, fontSize: 20, justifyContent: "space-between"}}>
                                        <div>0/20</div>
                                        <div>50ms</div>
                                        {/*pingInfo[rendercnt].isJavaEdition && 
                                            <div>
                                                <div>{pingInfo[rendercnt].online} / {pingInfo[rendercnt].max}</div>
                                                <div>{pingInfo[rendercnt].latency}</div>
                                        </div>*/}
                                    </Box>
                                    <CardButtons id={server.id} isOp={isOperator}/>
                                </Paper>
                            </Grid>)
                        })}
                    </Grid>
                </Box>
                <Divider variant="middle" sx={{paddingY: 1}}/>
                <Box sx={{fontSize: 30, paddingY: 1}}>{dict.list.subtitle[1]}</Box>
                <Box paddingY={1}>
                    <Grid container spacing={2}>
                        {TESTFINDS.servers.map(({id, name, logoLink, coverLink}) =>
                            <Grid item xs={4} key={id}>
                                <Paper elevation={3}>
                                    <ServerName logolink={logoLink} name={name} id={id}/>
                                    <Divider variant="middle"/>
                                    <Box sx={{display: "flex", flexDirection: "row", paddingX: 1, paddingY: 1}}>
                                        <img src={coverLink} style={{width: "100%"}}/>
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}