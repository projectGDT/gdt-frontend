"use client"

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"

import { GET, POST, backendAddress } from "@/utils";
import { Server, ServerInfo } from "@/types";
import Image from "next/image";

// 每次推荐的时候试图取回几个服务器数据
const RECOMMENDSIZE = 3;
// 第一次推荐的时候试图取回几个服务器数据
const FIRSTRECOMMENDSIZE = 6;
// 以上两个常量，后者**必须**是前者的倍数，且建议二者都为3的倍数

// 每个卡片上的服务器图标和名称
function ServerName(props: {logolink: string, name: string, id: number}) {
    const router = useRouter()
    return (
        <ListItemButton onClick={() => router.push(`/post-login/server/${props.id}`)}>
            <ListItemAvatar>
                <Avatar src={props.logolink} style={{width: 52, height: 52}} variant="rounded"/>
            </ListItemAvatar>
            {/* 等人数和延迟的 API 做好了再替换此处 secondary 的内容 */}
            <ListItemText 
                primary={props.name} primaryTypographyProps={{fontSize: 20, fontWeight: "medium"}}
                secondary={"0/20 50ms"}
                sx={{paddingX: 1}}
            />
        </ListItemButton>
    )
}

// 每个卡片下面的按钮
function CardButtons(props: {id: number, isOp: boolean}) {
    const router = useRouter()
    return (
        <Box sx={{display: "flex", flexDirection: "row-reverse", gap: 2, paddingX: 1, paddingY: 1}}>
            <Button variant="text" size="small" sx={{fontSize: 16}}>{dict.list.cardButtons[0]}</Button>
            {props.isOp && <Button variant="text" size="small" onClick={() => router.push(`/post-login/server/${props.id}/manage`)} sx={{fontSize: 16}}>{dict.list.cardButtons[1]}</Button>}
        </Box>
    )
}

export default function Page() {
    const router = useRouter()

    const [joinedServers, setJoinedServers] = useSessionStorage("joinedServers", [-1]);
    const [joinedServersInfo, setJoinedServersInfo] = useState<ServerInfo[]>([]);

    const [loadingJoinedServers, setLoadingJoinedServers] = useState(true); // 加入的服务器是否在刷新

    // 推荐功能
    const [recommendList, setRecommendList] = useState<number[]>([]);
    const [recommendCount, setRecommendCount] = useState(0);
    const [recommendInfo, setRecommendInfo] = useState<Server[]>([]);
    const [hasFirstFetched, setHasFirstFetched] = useState(false); // 为了防止重复调用而设的标志位
    
    // 下拉自动加载新内容
    const [loadingRecommend, setLoadingRecommend] = useState(true); // 推荐列表是否在刷新
    const scrollPos = useRef(0);
    
    // 获得已加入的服务器列表
    useEffect(() => {
        fetchServerList();
    }, []);

    // 获取发现服务器推荐列表
    useEffect(() => {
        fetchRecommendList();
    }, []);

    // 获取推荐列表中，服务器的信息（第一次）
    useEffect(() => {
        if (recommendList.length !== 0 && !hasFirstFetched) {
            fetchRecommendInfo();
            setHasFirstFetched(true);
        }
    }, [recommendList, hasFirstFetched])
    
    // 处理窗口滚动事件
    const handleScroll = () => {  
        if (loadingRecommend) return;  
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight) {  
            fetchRecommendInfo();
        }
    };

    // 添加监听器
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [recommendList, recommendCount])
    // 这块必须把 recommendList 和 recommendCount 设置成依赖项，每次他俩变化的时候要重新创建监听函数，否则会导致这个监听函数里
    // 获取到的 recommendList 和 recommendCount 一直是最初的初始值

    // 每次获取到新内容的时候，恢复指针的位置
    useEffect(() => {
        window.scrollTo(0, scrollPos.current);
    }, [recommendInfo, loadingRecommend])

    // 获取已加入服务器的列表
    const fetchServerList = () => {
        setLoadingJoinedServers(true); // 获取信息时候把刷新状态设为 true
        fetch(`${backendAddress}/post-login/me/servers`, GET(true))
            .then(response => {
                if (response.ok)
                    return response.json();
                else 
                    throw new Error(`HTTP ERROR, CODE: ${response.status}`);
            })
            .then(data => {
                setJoinedServersInfo(data);
                setJoinedServers(data.map((item: ServerInfo) => {return item.server.id}));
            })
            .finally(() => {
                setLoadingJoinedServers(false); // 最后把刷新状态设为 false
            })
    }

    // 获取推荐服务器的列表
    const fetchRecommendList = () => {
        setLoadingRecommend(true); // 获取信息时候把刷新状态设为 true
        fetch(`${backendAddress}/post-login/me/discover/list`, GET(true))
            .then(response => {
                if (response.ok)
                    return response.json();
                else 
                    throw new Error(`HTTP ERROR, CODE: ${response.status}`); // 暂时先这样处理错误
            })
            .then(data => {
                setRecommendList(data);
            })
            .finally(() => {
                setLoadingRecommend(false); // 最后把刷新状态设为 false
            })
    }

    // 获取推荐的服务器
    const fetchRecommendInfo = () => {
        scrollPos.current = window.scrollY;
        const currentIndex = hasFirstFetched ? recommendCount * RECOMMENDSIZE : recommendCount * FIRSTRECOMMENDSIZE;

        // 已经全都加载完了的情况：
        if (currentIndex >= recommendList.length) {
            return;
        }

        setLoadingRecommend(true);
        const fetchIndex: number[] = [];
        if (hasFirstFetched) {
            for (let i = 0; i + currentIndex < recommendList.length && i < RECOMMENDSIZE; i++) {
                fetchIndex.push(recommendList[i + currentIndex]);
            }
        }
        else {
            for (let i = 0; i + currentIndex < recommendList.length && i < FIRSTRECOMMENDSIZE; i++) {
                fetchIndex.push(recommendList[i + currentIndex]);
            }
        }

        fetch(`${backendAddress}/post-login/me/discover/query`, POST(fetchIndex, true))
            .then(response => {
                if (response.ok)
                    return response.json();
                else 
                    throw new Error(`HTTP ERROR, CODE: ${response.status}`); // 暂时先这样处理错误
            })
            .then(data => {
                setRecommendInfo(prevInfo => [...prevInfo, ...data]);
            })
            .finally(() => {
                setLoadingRecommend(false);
                setRecommendCount(hasFirstFetched ? (prevCount => prevCount + 1) : (FIRSTRECOMMENDSIZE / RECOMMENDSIZE));
            })
    }

    return (
        // 一个 Box 放下两栏：“我加入的”和“推荐”
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            {/* 我加入的 */}
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Typography variant="h4">{dict.list.subtitle[0]}</Typography>
                <Box sx={{display: "flex"}}>
                    {!loadingJoinedServers ? <Grid container spacing={2}>
                        {joinedServersInfo.map(({server, isOperator}) => {
                            return (<Grid item xs={3} key={server.id}>
                                <Paper elevation={3} sx={{display: "flex", flexDirection: "column"}}>
                                    <ServerName logolink={server.logoLink} name={server.name} id={server.id}/>
                                    <Divider/>
                                    <CardButtons id={server.id} isOp={isOperator}/>
                                </Paper>
                            </Grid>)
                        })}
                    </Grid> : <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}><CircularProgress/></Box>}
                </Box>
            </Box>

            {/* 发现 */}
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Typography variant="h4">{dict.list.subtitle[1]}</Typography>
                <Box sx={{display: "flex"}}>
                    <Grid container spacing={2}>
                        {recommendInfo.map((item) => {
                            return (
                                <Grid item xs={4} key={item.id}>
                                    <Paper elevation={3} sx={{display: "flex", flexDirection: "column"}}>
                                        <ServerName logolink={item.logoLink} name={item.name} id={item.id}/>
                                        <Box sx={{aspectRatio: 16/9, position: "relative"}}>
                                            <Image src={item.coverLink} alt={"Cover"} fill style={{objectFit: "cover"}}/>
                                        </Box>
                                    </Paper>
                                </Grid>
                            )})}
                    </Grid>
                </Box>
                {loadingRecommend && <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}><CircularProgress/></Box>}
            </Box>
        </Box>
    )
}