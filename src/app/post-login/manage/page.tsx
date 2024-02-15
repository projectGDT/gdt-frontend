"use client"

import React from "react";
import {useSearchParams} from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams()
    const id = searchParams.get("id") ?? "-1"

    return (
        <p>管理{id}号服务器</p>
    )
}