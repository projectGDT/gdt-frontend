export const GET = (withJWT: boolean): RequestInit => {
    const jwt = sessionStorage.getItem("jwt")
    return {
        method: "GET",
        headers: withJWT ? {
            "Authorization": `Bearer ${jwt != null ? jwt : ""}`
        } : {},
        redirect: "follow"
    }
}

export const POST = (dataObject: any, withJWT: boolean = true): RequestInit => {
    const jwt = sessionStorage.getItem("jwt")
    return {
        method: "POST",
        headers: withJWT ? {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt != null ? jwt : ""}`
        } : {
            "Content-Type": "application/json" // Currently only in login
        },
        body: JSON.stringify(dataObject),
        redirect: "follow"
    }
}

export const backendAddress = "http://localhost:14590"
// export const backendAddress = "http://127.0.0.1:4523/m1/3898612-0-default"  // 测试用