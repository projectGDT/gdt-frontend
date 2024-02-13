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
import React, {use, useEffect, useId, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"

// @/templates 定义了一些常量和模板
import Script from "next/script";
import { Image } from "@mui/icons-material";
import list, { space } from "postcss/lib/list";

import { GET, POST, backendAddress } from "@/utils";
import { Server, ServerInfo } from "@/types";

// 定义一种错误, 和网络错误区分开, 后面会有用
class IncorrectCredentialsError extends Error {
    constructor(props?: string | undefined) {
        super(props || undefined);
    }
}

// 每次推荐的时候试图取回几个服务器数据
const RECOMMENDSIZE = 3;
// 第一次推荐的时候试图取回几个服务器数据
const FIRSTRECOMMENDSIZE = 6;
// 以上两个常量，后者**必须**是前者的倍数，且建议二者都为3的倍数

// 每个卡片上的服务器图标和名称
function ServerName(props: {logolink: string, name: string, id: number}) {
    return (
        <Box sx={{paddingX: 1.5, paddingY: 1}}>
            <Box sx={{display: "flex", height: "auto"}}>
                <img src={props.logolink} style={{width: 64, height: 64}}/>
                {/*<Box sx={{display: "flex", alignItems: "center", paddingX: 1, fontSize: 23}}>{props.name}</Box>*/}
                <Link href={`/post-login/server/${props.id}`} color="inherit" underline="none" sx={{display: "flex", alignItems: "center", paddingX: 1, fontSize: 23}}>{props.name}</Link>
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
            {props.isOp && <Button variant="text" size="small" onClick={() => router.replace(`/post-login/server/${props.id}/manage`)}>{dict.list.cardButtons[1]}</Button>}
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

    const [joinedServers, setJoinedServers] = useSessionStorage("joinedServers", [-1]);
    const [refreshing, setRefreshing] = useState(true); // ???????????????????????????????????????
    const [joinedServersInfo, setJoinedServersInfo] = useState<ServerInfo[]>([]);

    // 推荐功能
    const [recommendList, setRecommendList] = useState<number[]>([]);
    const [recommendCount, setRecommendCount] = useState(0);
    const [recommendInfo, setRecommendInfo] = useState<Server[]>([]);
    const [hasFirstFetched, setHasFirstFetched] = useState(false); // 为了防止重复调用而设的标志位
    
    // 下拉自动加载新内容
    const [loading, setLoading] = useState(false); // ????????????????????????????????????????
    const scrollPos = useRef(0);
    
    // 获得已加入的服务器列表
    useEffect(() => {
        fetchServerList();
    }, []);

    // 获取发现服务器推荐列表，保存下来
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
    
    const handleScroll = () => {  
        if (loading) return;  
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight) {  
            fetchRecommendInfo();
        }
    };

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
    }, [recommendInfo, loading])

    const fetchServerList = () => {
        setRefreshing(true); // 获取信息时候把刷新状态设为 true
        fetch(`${backendAddress}/post-login/me/servers`, GET(true))
            .then(response => {
                if (response.ok)
                    return response.json();
                else 
                    throw new Error(`HTTP ERROR, CODE: ${response.status}`); // 暂时先这样处理错误
            })
            .then(data => {
                setJoinedServersInfo(data);
                setJoinedServers(data.map((item: ServerInfo) => {return item.server.id}));
            })
            .catch(error => {
                console.error(error); // 暂时先这样处理错误
            })
            .finally(() => {
                setRefreshing(false); // 最后把刷新状态设为 false
            })
    }

    const fetchRecommendList = () => {
        setRefreshing(true); // 获取信息时候把刷新状态设为 true
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
            .catch(error => {
                console.error(error); // 暂时先这样处理错误
            })
            .finally(() => {
                setRefreshing(false); // 最后把刷新状态设为 false
            })
    }

    const fetchRecommendInfo = () => {
        scrollPos.current = window.scrollY;
        setRefreshing(true); // 获取信息时候把刷新状态设为 true
        setLoading(true);

        const currentIndex = hasFirstFetched ? recommendCount * RECOMMENDSIZE : recommendCount * FIRSTRECOMMENDSIZE;

        // 已经全都加载完了的情况：
        if (currentIndex >= recommendList.length) {
            setRefreshing(false);
            setLoading(false);
            return;
        }

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
            .catch(error => {
                console.error(error); // 暂时先这样处理错误
            })
            .finally(() => {
                setRefreshing(false); // 最后把刷新状态设为 false
                setLoading(false);
                setRecommendCount(hasFirstFetched ? (prevCount => prevCount + 1) : (FIRSTRECOMMENDSIZE / RECOMMENDSIZE));
            })
    }

    // 在 return 里面加一个加载动画，根据 refreshing 判断
    return !refreshing && (
        // 一个 Box 放下两栏：“我加入的”和“推荐”
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Box sx={{display: "flex", flexDirection: "column", height: "40vh"}}>
                <Box sx={{fontSize: 30}}>{dict.list.subtitle[0]}</Box>
                <Box paddingY={1}>
                    <Grid container spacing={2}>
                        {joinedServersInfo.map(({server, isOperator}) =>{
                            //rendercnt += 1;
                            return (<Grid item xs={3} key={server.id}>
                                <Paper elevation={3}>
                                    <ServerName logolink={server.logoLink} name={server.name} id={server.id}/>
                                    <Divider variant="middle"/>
                                    <Box sx={{display: "flex", flexDirection: "row", height: "8vh", paddingX: 2, paddingY: 1, fontSize: 20, justifyContent: "space-between"}}>
                                        <div>0/20</div>
                                        <div>50ms</div>
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
                        {recommendInfo.map((item) =>
                            <Grid item xs={4} key={item.id}>
                                <Paper elevation={3}>
                                    <ServerName logolink={item.logoLink} name={item.name} id={item.id}/>
                                    <Divider variant="middle"/>
                                    <Box sx={{display: "flex", flexDirection: "row", paddingX: 1, paddingY: 1}}>
                                        <img src={item.coverLink} style={{width: "100%"}}/>
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Box>
                {loading && <Box>loading...</Box>}
            </Box>
        </Box>
    )
}