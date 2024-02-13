"use client"

import {
    Box, Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, Grid, Stack, Typography,
} from "@mui/material";
import React, { useEffect } from "react";
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
            isModded: false
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

const TESTPLAYER = [
  {
    ownerId: 65,
    players: [
      {
        id: 20,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: false
      },
      {
        id: 65,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
      {
        id: 21,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
    ]
  },
  {
    ownerId: 65,
    players: [
      {
        id: 20,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: false
      },
      {
        id: 65,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
      {
        id: 21,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
    ]
  },
  {
    ownerId: 65,
    players: [
      {
        id: 20,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: false
      },
      {
        id: 65,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
      {
        id: 21,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
    ]
  },
  {
    ownerId: 65,
    players: [
      {
        id: 20,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: false
      },
      {
        id: 65,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
      {
        id: 21,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
    ]
  },
  {
    ownerId: 65,
    players: [
      {
        id: 20,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: false
      },
      {
        id: 65,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
      {
        id: 21,
        profiles: [
          {
            uniqueIdProvider: -3,
            uniqueId: "2562575271538721",
            cachedPlayerName: "Gi_Hiyo"
          }
        ],
        isOperator: true
      },
    ]
  },
]

const TESTMOD = {
  formatVersion: 1,
  game: "minecraft",
  versionId: "5.6.4",
  name: "Fabulously Optimized",
  summary: "Improve your graphics and performance with this simple modpack.",
  files: [
    {
      path: "mods/animatica-0.6+1.20.jar",
      hashes: {
        sha1: "3bcb19c759f313e69d3f7848b03c48f15167b88d",
        sha512: "7d50f3f34479f8b052bfb9e2482603b4906b8984039777dc2513ecf18e9af2b599c9d094e88cec774f8525345859e721a394c8cd7c14a789c9538d2533c71d65"
      },
      downloads: [
        "https://cdn.modrinth.com/data/PRN43VSY/versions/uNgEPb10/animatica-0.6%2B1.20.jar"
      ],
      fileSize: 69810
    },
    {
      path: "mods/bettermounthud-1.2.2.jar",
      hashes: {
        sha1: "6942fb39ca2e87208b0b0630a5efc4511c82dcf4",
        sha512: "1275717f84ece63f59714162a68b4e19ca626f843acefbfca49f4d446665559edd007db20cf4e66abf9ff1e76fe05f36bf5ca88fb1e63ef78c15a6b7fef01bb6"
      },
      downloads: [
        "https://cdn.modrinth.com/data/kqJFAPU9/versions/h1QpxElt/bettermounthud-1.2.2.jar"
      ],
      fileSize: 21587
    },
    {
      path: "mods/borderless-mining-1.1.9+1.20.2.jar",
      hashes: {
        sha1: "cf26d4615041f2db6df6b6906c5475fac05030e0",
        sha512: "8b58ab2c2ada9f8267aaf127ba7886c3fa8e915194e95c187fb52c11bb3c0a63d6c6455fc14e5bba2694c848e09c426350b3b00a2267dd0248e9ce670fe2e70a"
      },
      download: [
        "https://cdn.modrinth.com/data/kYq5qkSL/versions/r2hHx4zB/borderless-mining-1.1.9%2B1.20.2.jar",
        "https://github.com/comp500/BorderlessMining/releases/download/1.1.9%2B1.20.2/borderless-mining-1.1.9%2B1.20.2.jar"
      ],
      fileSize: 121765
    },
    {
      path: "mods/capes-1.5.3+1.20.2-fabric.jar",
      hashes: {
        sha1: "c1a62a847753d9ae039bff35050326a081d2e500",
        sha512: "385be9c93aa4d4ed4e8225c9a1ca6c4dc93ed0dfd0d645b3760b7e4bf6288d7bc0d5cbe256c5faffc2b27e9db6905612b7153f56bcc463abfe9e2c66ec9c0b34"
      },
      download: [
        "https://cdn.modrinth.com/data/89Wsn8GD/versions/dEq1ncBU/capes-1.5.3%2B1.20.2-fabric.jar",
        "https://github.com/CaelTheColher/Capes/releases/download/fabric-1.5.3%2B1.20.2/capes-1.5.3%2B1.20.2-fabric.jar"
      ],
      fileSize: 209297
    },
    {
      path: "mods/CITResewn-1.1.3+1.20.jar",
      hashes: {
        sha1: "53f036ebe51d7d97afaf44d541775c92c4470dad",
        sha512: "9cd0d8445e65e530cbe1df26809cdf56b84502146f0dd601c47a7ba5df8dd8b861d1cc0344e06cd5277dac71c448376f01ea12be953644ebcba76a8b63befed5"
      },
      download: [
        "https://cdn.modrinth.com/data/otVJckYQ/versions/c7Lo4vij/CITResewn-1.1.3%2B1.20.jar"
      ],
      fileSize: 394652
    },
    {
      path: "resourcepacks/Chat Reporting Helper.zip",
      hashes: {
        sha1: "462f8cbc0727b3242b28bd5ed885052b1d197771",
        sha512: "d84f79af9730a3e5e12363ac3886b7831edecae6c84b65003745d177c4064ee17b5ed6416aed1f8c254d995e2ac5e15d65dc553763d971443539b263bb360d79"
      },
      downloads: [
        "https://cdn.modrinth.com/data/tN4E9NfV/versions/2vSy3UV7/Chat%20Reporting%20Helper.zip"
      ],
      fileSize: 53993
    },
  ],
  dependencies: {
    minecraft: "1.20.2",
    fabric_loader: "0.15.3"
  }
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

    const server = TESTINFO[parseInt(params.id)];
    const playerInfo = TESTPLAYER[parseInt(params.id)];
    const modInfo = TESTMOD;

    useEffect(
      () => {
        playerInfo.players.sort(
          (a, b) => {
            if (a.id === playerInfo.ownerId)
              return -1;
            if (b.id === playerInfo.ownerId)
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
      }, []);

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
                                            {server.javaRemote.isModded &&
                                            <div>
                                              <Divider/>
                                              {/*mod 列表*/}
                                              <Typography variant="h6" gutterBottom paddingY={1}>{dict.serverid.modTitle[1]}</Typography>
                                                <Stack spacing={1}>
                                                   {/*MOD 列表*/} 
                                                   {modInfo.files.map(
                                                    (item) => {
                                                      return (
                                                        //<Card variant="outlined">
                                                          <Box sx={{display: "flex", alignItems: "center"}}>
                                                            <Typography variant="body1" gutterBottom paddingX={1}>
                                                              {item.path[0] === "m" && item.path.slice(5, item.path.length - 4)}
                                                            </Typography>
                                                          </Box>
                                                          
                                                        //</Card>
                                                        
                                                      )})}
                                                </Stack>
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
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography variant="h5" gutterBottom>{dict.serverid.cardTitle[3]}{`（${playerInfo.players.length}人）`}</Typography>
                                    </Box>
                                    {/*玩家列表*/}
                                    {joinedServers.includes(server.id) ? 
                                      <Stack spacing={1} paddingY={1}>
                                        {playerInfo.players.map(
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
                                              {playerInfo.players.indexOf(item) === 0 ?
                                                <Box sx={{fontSize: 16, display: "flex", alignItems: "center", color: "secondary.main"}}>{dict.serverid.authName[0]}</Box> :
                                                item.isOperator && <Box sx={{fontSize: 16, display: "flex", alignItems: "center", color: "secondary.light"}}>{dict.serverid.authName[1]}</Box>
                                              }
                                            </Box>)
                                          }
                                        )}
                                      </Stack> :
                                      <Box>
                                        {/*提示信息*/}
                                        <Typography variant="body2" color="GrayText" marginLeft={1}>{`${server.applyingPolicy === ApplyingPolicy.BY_FORM ? dict.serverid.accessPrompt[0] : dict.serverid.accessPrompt[1]}，以获取完整玩家列表`}</Typography>
                                      </Box>
                                    }
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}