"use client"

import React from "react";
import {useRouter} from "next/navigation";

export default function Page({ params }:{ params: { id: number } }) {
    const router = useRouter()

    return (
        <p>管理{params.id}号服务器</p>
    )
}