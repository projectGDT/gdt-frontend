// 用户submit后跳转到此页面，提示用户发送验证信息，SSE等待服务器响应
// 必须在客户端渲染此页面，否则sessionStorage会报错
"use client"

export default function Page() {
    const emailAddr = sessionStorage.getItem('emailAddr');
    const passkey = sessionStorage.getItem('passkey');
    return (
        <>
            <p>{emailAddr}</p>
            <p>{passkey}</p>
        </>
    );
    // TODO
}