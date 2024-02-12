export const GET = (withJWT: boolean = true): RequestInit => {
    const jwtRaw = sessionStorage.getItem("jwt")
    return {
        headers: withJWT ? {
            "Authorization": `Bearer ${jwtRaw != null ? JSON.parse(jwtRaw) : ""}`
        } : {},
        cache: "no-store"
    }
}

export const POST = (dataObject: any, withJWT: boolean = true): RequestInit => {
    const jwtRaw = sessionStorage.getItem("jwt")
    // 陷阱: 这里的 jwtRaw 是双引号环绕下的 jwt！
    // 这是因为 useSessionStorage 以 Raw Json 格式存储数据.
    // 给其提供一个字符串, 它将会将字符串转化为 JSON 形式 -- 也就是 "{str}"。

    return {
        method: "POST",
        headers: withJWT ? {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtRaw != null ? JSON.parse(jwtRaw) : ""}`
        } : {
            "Content-Type": "application/json" // Currently only in login
        },
        body: JSON.stringify(dataObject)
    }
}

export const backendAddress = "http://localhost:14590"