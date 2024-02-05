"use client"

import {
    Box, Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, Grid, Stack, Typography,
} from "@mui/material";
import React from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"

const ApplyingPolicy = {
    CLOSED: "CLOSED",
    ALL_OPEN: "ALL_OPEN",
    BY_FORM: "BY_FORM"
}

const TESTINFO = [
    {
        id: 0,
        name: "TimelessMC 建筑/生电",
        logoLink: "http://dummyimage.com/128x128",
        coverLink: "http://dummyimage.com/1280x720",
        introduction: "do aute labore",
        owner: 1,
        players: [
          {
            id: 1,
            isManager: true
          },
          {
            id: 49,
            isManager: false
          }
        ],
        javaRemote: {
          address: "je.timelessmc.cn",
          port: 25565,
          coreVersion: "1.20.1",
          compatibleVersions: [
            "1.19",
            "1.20",
            [
              "1.20.2",
              "1.20.4"
            ]
          ],
          uniqueIdProvider: -1,
            isModded: true
        },
        bedrockRemote: {
          address: "example.com",
          port: 12345,
          coreVersion: "1.20.0",
          compatibleVersions: [
            "1.19",
            "1.20",
            [
              "1.20.2",
              "1.20.4"
            ]
          ]
        },
        applyingPolicy: "ALL_OPEN"
    },
    {
        id: 1,
        name: "TimelessMC 建筑/生电",
        logoLink: "http://dummyimage.com/128x128",
        coverLink: "http://dummyimage.com/1280x720",
        introduction: "do aute labore",
        owner: 1,
        players: [
          {
            id: 1,
            isManager: true
          },
          {
            id: 49,
            isManager: false
          }
        ],
        bedrockRemote: {
          address: "example.com",
          port: 12345,
          coreVersion: "1.20.0",
          compatibleVersions: [
            "1.19",
            "1.20",
            [
              "1.20.2",
              "1.20.4"
            ]
          ]
        },
        applyingPolicy: "ALL_OPEN"
    },
    {
        id: 2,
        name: "TimelessMC 建筑/生电",
        logoLink: "http://dummyimage.com/128x128",
        coverLink: "http://dummyimage.com/1280x720",
        introduction: "do aute labore",
        owner: 1,
        players: [
          {
            id: 1,
            isManager: true
          },
          {
            id: 49,
            isManager: false
          }
        ],
        javaRemote: {
          address: "je.timelessmc.cn",
          port: 25565,
          coreVersion: "1.20.1",
          compatibleVersions: [
            "1.19",
            "1.20",
            [
              "1.20.2",
              "1.20.4"
            ]
          ],
          uniqueIdProvider: -1,
            isModded: true
        },
        applyingPolicy: "ALL_OPEN"
    },
    {
        id: 3,
        name: "TimelessMC 建筑/生电",
        logoLink: "http://dummyimage.com/128x128",
        coverLink: "http://dummyimage.com/1280x720",
        introduction: "do aute labore",
        owner: 1,
        players: [
          {
            id: 1,
            isManager: true
          },
          {
            id: 49,
            isManager: false
          }
        ],
        javaRemote: {
          address: "je.timelessmc.cn",
          port: 25565,
          coreVersion: "1.20.1",
          compatibleVersions: [
            "1.19",
            "1.20",
            [
              "1.20.2",
              "1.20.4"
            ]
          ],
          uniqueIdProvider: -1,
            isModded: true
        },
        bedrockRemote: {
          address: "example.com",
          port: 12345,
          coreVersion: "1.20.0",
          compatibleVersions: [
            "1.19",
            "1.20",
            [
              "1.20.2",
              "1.20.4"
            ]
          ]
        },
        applyingPolicy: "BY_FORM"
    },
    {
        id: 4,
        name: "TimelessMC 建筑/生电",
        logoLink: "http://dummyimage.com/128x128",
        coverLink: "http://dummyimage.com/1280x720",
        introduction: "do aute labore",
        owner: 1,
        players: [
          {
            id: 1,
            isManager: true
          },
          {
            id: 49,
            isManager: false
          }
        ],
        javaRemote: {
          address: "je.timelessmc.cn",
          port: 25565,
          coreVersion: "1.20.1",
          compatibleVersions: [
            "1.19",
            "1.20",
            [
              "1.20.2",
              "1.20.4"
            ]
          ],
          uniqueIdProvider: -1,
            isModded: true
        },
        bedrockRemote: {
          address: "example.com",
          port: 12345,
          coreVersion: "1.20.0",
          compatibleVersions: [
            "1.19",
            "1.20",
            [
              "1.20.2",
              "1.20.4"
            ]
          ]
        },
        applyingPolicy: "CLOSED"
    },
]

// 标题
function ServerHeader(props: {logoLink: string, name: string, id: number, applyingPolicy: string}) {
    const [joinedServers, setJoinedServers] = useSessionStorage("joinedServers", [-1]);

    return (
        <div>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Box sx={{display: "flex", height: "auto", paddingX: 1}}>
                    <img src={props.logoLink} width={64} height={64}/>
                    <Box sx={{display: "flex", alignItems: "center", fontSize: 25, paddingX: 2.5}}>{props.name}</Box>
                </Box>
                <Box sx={{display: "flex", alignItems: "center", fontSize: 28, paddingX: 1}}>
                    { joinedServers.includes(props.id) ? 
                        <Stack direction="row" spacing={1}>
                            <Button size="large">{dict.serverid.headerButtons[0]}</Button>
                            <Button size="large">{dict.serverid.headerButtons[1]}</Button>
                        </Stack> : <Box>
                            {props.applyingPolicy === ApplyingPolicy.BY_FORM ? 
                                <Button size="large">{dict.serverid.headerButtons[2]}</Button> : 
                                (props.applyingPolicy === ApplyingPolicy.ALL_OPEN ? 
                                    <Button size="large">{dict.serverid.headerButtons[3]}</Button> : 
                                    <Button size="large" disabled>{dict.serverid.headerButtons[3]}</Button>
                                )
                            }
                        </Box>
                    }
                </Box>
            </Box>
            <Divider variant="middle" sx={{paddingY: 0.5}}/>
        </div>
        
    )
}

// 版本信息，能不能抽象出来呢？
function VersionInfo(props: {}) {

}

// 这一块的内容会套在 /src/app/layout.jsx 定义的东西里面
export default function Page({ params }:{ params: { id: string } }) {
    const router = useRouter()

    const [joinedServers, setJoinedServers] = useSessionStorage("joinedServers", [-1]);

    const server = TESTINFO[parseInt(params.id)];

    return (
        <>
            <ServerHeader logoLink={server.logoLink} name={server.name} id={parseInt(params.id)} applyingPolicy={server.applyingPolicy}/>
            <Box sx={{display: "flex", height: "100vh"}}>
                <Grid container>
                    <Grid item xs={8.8}>
                        <Box sx={{paddingY: 1}}>
                            <Grid container>
                                <Grid item xs={2}/>
                                <Grid item xs={8}>
                                    <img src={server.coverLink} style={{width: "100%"}}/>
                                </Grid>
                                <Grid item xs={2}/>
                            </Grid>
                            <Divider/>
                            <p>{server.introduction}</p>
                        </Box>
                    </Grid>

                    <Grid item xs={0.2}>
                        <Divider orientation="vertical" variant="middle"/>
                    </Grid>

                    <Grid item xs={3}>
                        <Stack spacing={1} paddingY={1} paddingX={1}>
                            {/*延迟和在线人数*/}
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>{dict.serverid.cardTitle[0]}</Typography>
                                    {/*TODO：做成可点击的*/}
                                    <Box sx={{display: "flex", justifyContent: "space-between", paddingX: 1}}>
                                        <div>0/20</div>
                                        <div>50ms</div>
                                    </Box>
                                </CardContent>
                            </Card>
                            {/*Java版信息*/}
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography variant="h5" gutterBottom>{dict.serverid.cardTitle[1]}</Typography>
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
                                    {/*下面的版本信息，能不能抽象成一个组件呢？*/}
                                    {server.javaRemote && 
                                        <Stack spacing={1} paddingY={1}>
                                            <Grid container>
                                                <Grid item xs={4}>
                                                    <Typography variant="subtitle1" gutterBottom>{dict.serverid.cardSubtitle[0]}</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Box sx={{display: "flex", flexDirection: "row-reverse"}}>
                                                        <Typography variant="body2">{/*TODO: map一下版本列表*/}1.20.1</Typography>
                                                    </Box>
                                                    
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={4}>
                                                    <Typography variant="subtitle1" gutterBottom>{dict.serverid.cardSubtitle[1]}</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Box sx={{display: "flex", flexDirection: "row-reverse"}}>
                                                        <Typography variant="body2">{/*TODO: map一下版本列表*/}1.20.1, 1.7.10</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            {/*TODO: mod信息*/}
                                        </Stack>
                                    }
                                </CardContent>
                            </Card>
                            {/*基岩版信息*/}
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography variant="h5" gutterBottom>{dict.serverid.cardTitle[2]}</Typography>
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
                                    {/*下面的版本信息，能不能抽象成一个组件呢？*/}
                                    {server.bedrockRemote && 
                                        <Stack spacing={1} paddingY={1}>
                                            <Grid container>
                                                <Grid item xs={4}>
                                                    <Typography variant="subtitle1" gutterBottom>{dict.serverid.cardSubtitle[0]}</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Box sx={{display: "flex", flexDirection: "row-reverse"}}>
                                                        <Typography variant="body2">{/*TODO: map一下版本列表*/}1.20.1</Typography>
                                                    </Box>
                                                    
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={4}>
                                                    <Typography variant="subtitle1" gutterBottom>{dict.serverid.cardSubtitle[1]}</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Box sx={{display: "flex", flexDirection: "row-reverse"}}>
                                                        <Typography variant="body2">{/*TODO: map一下版本列表*/}1.20.1, 1.7.10</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    }
                                </CardContent>
                            </Card>
                            {/*玩家列表*/}
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography variant="h5" gutterBottom>{dict.serverid.cardTitle[3]}</Typography>
                                        {/*TODO: 显示玩家总数*/}
                                    </Box>
                                    {/*TODO: 判断是否已加入，显示不同的内容*/}
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}