"use client"

import {
  Avatar,
    Box, Button, Card, CardContent, CardHeader, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Stack, Typography,
    darken,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"
import { Dependency, ModInfo, PlayerInfo, WholeServer } from "@/types";
import { GET, backendAddress } from "@/utils";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { ModList } from "@/components/mod-list";
import { MuiMarkdown, getOverrides } from "mui-markdown";

const ApplyingPolicy = {
    CLOSED: "CLOSED",
    ALL_OPEN: "ALL_OPEN",
    BY_FORM: "BY_FORM"
}

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

    // 整个页面信息 server
    const [server, setServer] = useState<WholeServer>(null!);
    const [refreshing, setRefreshing] = useState(true);

    // 获取 server 信息
    useEffect(() => {
        setRefreshing(true); // 获取信息时候把刷新状态设为 true
        fetch(`${backendAddress}/server-meta/${params.id}`, GET(false))
            .then(response => {
                if (response.ok)
                    return response.json();
                else 
                    throw new Error(`HTTP ERROR, CODE: ${response.status}`); // 暂时先这样处理错误
            })
            .then(data => {
                // console.log(data);
                setServer(data);
            })
            .catch(error => {
                console.error(error); // 暂时先这样处理错误
            })
            .finally(() => {
                setRefreshing(false); // 最后把刷新状态设为 false
            })
    }, [])

    // 玩家列表 playerInfo
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true);

    // 获取 player 信息
    useEffect(() => {
        setLoadingPlayers(true); // 获取信息时候把刷新状态设为 true
        fetch(`${backendAddress}/post-login/people/server-players/${params.id}`, GET(true))
            .then(response => {
                if (response.ok)
                    return response.json();
                else 
                    throw new Error(`HTTP ERROR, CODE: ${response.status}`); // 暂时先这样处理错误
            })
            .then(data => {
                // console.log(data);
                setPlayerInfo(data);
            })
            .catch(error => {
                console.error(error); // 暂时先这样处理错误
            })
            .finally(() => {
                setLoadingPlayers(false); // 最后把刷新状态设为 false
            })
    }, [server])

    // 为 player 排序
    useEffect(
      () => {
        if (server) {
          playerInfo.sort(
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
        }
      }, [server, playerInfo]);

    return !refreshing && (
        <>
            {/*测试用*/}
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
                            <MuiMarkdown
                                overrides={{
                                    ...getOverrides(), // This will keep the other default overrides.
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
                                }}>
                                {server.introduction}
                            </MuiMarkdown>
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
                                                        <Typography variant="body2">{server.javaRemote.coreVersion}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={4}>
                                                    <Typography variant="subtitle1" gutterBottom>{dict.serverid.cardSubtitle[1]}</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Box sx={{display: "flex", flexDirection: "row-reverse"}}>
                                                        <Typography variant="body2">{server.javaRemote.compatibleVersions.map(
                                                          (item) => {
                                                            if (typeof(item) === "string") return `${item}; `;
                                                            else return `${item[0]} ~ ${item[1]}; `;
                                                          })}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            {/*mod 信息*/}
                                            {server.javaRemote.modpackVersionId &&
                                            <div>
                                              <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                <Divider/>
                                                <Typography variant="h6">{dict.serverid.modTitle[1]}</Typography>
                                              </Box>
                                              {/*mod 列表*/}
                                                <ModList versionId={server.javaRemote.modpackVersionId}/>
                                            </div>
                                              
                                            }
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
                                          {/*如果 java 和基岩版都支持，那么基岩版不渲染核心版本*/}
                                            {!server.javaRemote && 
                                              <Grid container>
                                                <Grid item xs={4}>
                                                    <Typography variant="subtitle1" gutterBottom>{dict.serverid.cardSubtitle[0]}</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Box sx={{display: "flex", flexDirection: "row-reverse"}}>
                                                        <Typography variant="body2">{server.bedrockRemote.coreVersion}</Typography>
                                                    </Box>
                                                    
                                                </Grid>
                                              </Grid>
                                            }
                                            <Grid container>
                                                <Grid item xs={4}>
                                                    <Typography variant="subtitle1" gutterBottom>{dict.serverid.cardSubtitle[1]}</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Box sx={{display: "flex", flexDirection: "row-reverse"}}>
                                                    <Typography variant="body2">{server.bedrockRemote.compatibleVersions.map(
                                                          (item) => {
                                                            if (typeof(item) === "string") return `${item}; `;
                                                            else return `${item[0]} ~ ${item[1]}; `;
                                                          })}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    }
                                </CardContent>
                            </Card>
                            {/*玩家列表*/}
                            {!loadingPlayers && (
                              <Card variant="outlined">
                              <CardContent>
                                  <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                      <Typography variant="h5" gutterBottom>{dict.serverid.cardTitle[3]}{`${dict.serverid.playerCount[0]}${playerInfo.length}${dict.serverid.playerCount[1]}`}</Typography>
                                  </Box>
                                  {/*玩家列表*/}
                                  {joinedServers.includes(server.id) ? 
                                    <Stack spacing={1} paddingY={1}>
                                      {playerInfo.map(
                                        (item) => {
                                          return (<Box sx={{display: "flex", justifyContent: "space-between"}} key={item.id}>
                                            <Box sx={{display: "flex", alignItems: "center"}}>
                                              <img src="http://dummyimage.com/128x128" style={{width: 32, height: 32}}/>
                                              <Box sx={{fontSize: 16, paddingX: 1}}>
                                                {item.profiles.length == 1 ? item.profiles[0].cachedPlayerName :
                                                    (item.profiles[0].uniqueId > item.profiles[1].uniqueId) ? item.profiles[0].cachedPlayerName : item.profiles[1].cachedPlayerName
                                                }
                                              </Box>
                                              
                                            </Box>
                                            {playerInfo.indexOf(item) === 0 ?
                                              <Box sx={{fontSize: 16, display: "flex", alignItems: "center", color: "secondary.main"}}>{dict.serverid.authName[0]}</Box> :
                                              item.isOperator && <Box sx={{fontSize: 16, display: "flex", alignItems: "center", color: "secondary.light"}}>{dict.serverid.authName[1]}</Box>
                                            }
                                          </Box>)
                                        }
                                      )}
                                    </Stack> :
                                    <Box>
                                      {/*提示信息*/}
                                      <Typography variant="body2" color="GrayText" marginLeft={1}>{`${server.applyingPolicy === ApplyingPolicy.BY_FORM ? dict.serverid.accessPrompt[1] : dict.serverid.accessPrompt[2]}${dict.serverid.accessPrompt[3]}`}</Typography>
                                    </Box>
                                  }
                              </CardContent>
                          </Card>
                          )}
                            
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}