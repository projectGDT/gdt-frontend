export const GET = (withJWT: boolean): RequestInit => {
    const jwt = sessionStorage.getItem("jwt")
    return {
        headers: withJWT ? {
            "Authorization": `Bearer ${jwt != null ? jwt : ""}`
        } : {}
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
        body: JSON.stringify(dataObject)
    }
}

export const backendAddress = "http://localhost:14590"

export const backendAddressWs = "ws://localhost:14590"