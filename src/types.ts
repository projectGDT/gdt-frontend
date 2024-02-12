export interface ServerInfo {
    server: {
        applyingPolicy: string;
        id: number;
        name: string;
        logoLink: string;
    };
    isOperator: boolean;
}

export interface Server {
    coverLink: string;
    id: number;
    name: string;
    logoLink: string;
    applyingPolicy: string;
}
