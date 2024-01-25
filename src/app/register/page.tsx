"use client"

import {
    Alert,
    Box,
    Button, Collapse,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import React, {useEffect, useId, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useSessionStorage} from "usehooks-ts";

import {dict} from "@/i18n/zh-cn"

// @/templates 定义了一些常量和模板
import {backendAddress, GET, POST} from "@/templates";
import Script from "next/script";

export default function Page() {
    return <p>Register page</p>;
    // TODO
}