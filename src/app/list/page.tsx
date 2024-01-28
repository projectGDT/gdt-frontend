"use client"

import {
    Alert,
    Box,
    Button, Card, CardMedia, Collapse,
    Container,
    Divider,
    Grid,
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
import {backendAddress, POST} from "@/templates";
import Script from "next/script";
import { Image } from "@mui/icons-material";
import { space } from "postcss/lib/list";

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
            logolink: "http://dummyimage.com/336x280",
            remote: {
                address: "mc.example.com",
                port: 19132,
                protocol: "BEDROCK",
            },
            uniqueIdProvider: [
                -1,
                -3,
            ]
        },
        isOperator: true,
    },
    {
        server: {
            id: 2,
            name: "TimelessMC", 
            logolink: "http://dummyimage.com/336x280",
            remote: {
                address: "mc.example.com",
                port: 19132,
                protocol: "BEDROCK",
            },
            uniqueIdProvider: [
                -1,
                -3,
            ]
        },
        isOperator: true,
    },
    {
        server: {
            id: 3,
            name: "TimelessMC", 
            logolink: "http://dummyimage.com/336x280",
            remote: {
                address: "mc.example.com",
                port: 19132,
                protocol: "BEDROCK",
            },
            uniqueIdProvider: [
                -1,
                -3,
            ]
        },
        isOperator: true,
    },
    {
        server: {
            id: 4,
            name: "TimelessMC", 
            logolink: "http://dummyimage.com/336x280",
            remote: {
                address: "mc.example.com",
                port: 19132,
                protocol: "BEDROCK",
            },
            uniqueIdProvider: [
                -1,
                -3,
            ]
        },
        isOperator: true,
    },
    {
        server: {
            id: 5,
            name: "TimelessMC", 
            logolink: "http://dummyimage.com/336x280",
            remote: {
                address: "mc.example.com",
                port: 19132,
                protocol: "BEDROCK",
            },
            uniqueIdProvider: [
                -1,
                -3,
            ]
        },
        isOperator: true,
    }
]

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

    return (
        // 一个 Box 放下两栏：“我加入的”和“推荐”
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Box sx={{display: "flex", flexDirection: "column", height: "40vh"}}>
                <Box sx={{fontSize: 30}}>{dict.list.subtitle[0]}</Box>
                <Box paddingY={1}>
                    <Grid container spacing={2}>
                        {TESTITEMS.map(({server, isOperator}) =>
                            <Grid item xs={3}>
                                <Paper elevation={3}>
                                    <Box sx={{display: "flex", flexDirection: "row", height: "10vh", paddingX: 1.5, paddingY: 1}}>
                                        <Box sx={{display: "flex", height: "8vh"}}>
                                            <img src={server.logolink}/>
                                            <Box sx={{display: "flex", alignItems: "center", paddingX: 1, fontSize: 23}}>{server.name}</Box>
                                        </Box>
                                    </Box>
                                    <Divider variant="middle"/>
                                    <Box sx={{display: "flex", flexDirection: "row", height: "12vh", paddingX: 1, paddingY: 1}}>
                                        这里是人数和延迟
                                    </Box>
                                    <Box sx={{display: "flex", paddingX: 1, paddingY: 1, flexDirection: "row-reverse"}}>
                                        这里放按钮
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Box>
                <Divider variant="middle" sx={{paddingY: 1}}/>
                <Box sx={{fontSize: 30, paddingY: 1}}>{dict.list.subtitle[1]}</Box>
                <Box paddingY={1}>
                    <Grid container spacing={1}>
                        {TESTITEMS.map(({server, isOperator}) =>
                            <Grid item xs={6}>
                                <Paper elevation={3}>
                                    <Box sx={{display: "flex", flexDirection: "row", height: "10vh", paddingX: 1.5, paddingY: 1}}>
                                        <Box sx={{display: "flex", height: "8vh"}}>
                                            <img src={server.logolink}/>
                                            <Box sx={{display: "flex", alignItems: "center", paddingX: 1, fontSize: 23}}>{server.name}</Box>
                                        </Box>
                                    </Box>
                                    <Divider variant="middle"/>
                                    <Box sx={{display: "flex", flexDirection: "row", height: "15vh", paddingX: 1, paddingY: 1}}>
                                        这里是cover
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