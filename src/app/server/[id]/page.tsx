"use client"

import {
    Box,
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
import { useSearchParams } from "react-router-dom";

// 定义一种错误, 和网络错误区分开, 后面会有用
class IncorrectCredentialsError extends Error {
    constructor(props?: string | undefined) {
        super(props || undefined);
    }
}

// 这一块的内容会套在 /src/app/layout.jsx 定义的东西里面
export default function Page({ params }:{ params: { id: number } }) {
    const router = useRouter()
    const formRef = useRef()

    // React 中的 State, 一种可以在多次渲染之间暂存的变量, 详见文档
    const [incorrectCredentialsOpen, setIncorrectCredentialsOpen] = useState(false)
    const [networkErrorOpen, setNetworkErrorOpen] = useState(false)

    const [id, setId] = useSessionStorage("id", -1)
    const [isSiteAdmin, setIsSiteAdmin] = useSessionStorage("isSiteAdmin", false)
    const [jwt, setJWT] = useSessionStorage("jwt", "")

    return (
        <p>{params.id}</p>
    )
}