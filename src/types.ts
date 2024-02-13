
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

export interface WholeServer {
    id: number;
    ownerId: number;
    groupId: number;
    name: string;
    logoLink: string;
    coverLink: string;
    introduction: string;
    javaRemote?: {
        address: string;
        port: number;
        coreVersion: string;
        compatibleVersions: (string | string[])[];
        uniqueIdProvider: number;
        modpackInfo?: string;
        serverId: number;
    };
    bedrockRemote?: {
        address: string;
        port: number;
        coreVersion: string;
        compatibleVersions: (string | string[])[];
    };
    applyingPolicy: string;
}

interface Profile {
    uniqueIdProvider: number;
    uniqueId: string;
    cachedPlayerName: string;
}

export interface PlayerInfo {
    id: number;
    profiles: Profile[];
    isOperator: boolean;
}

export interface ModInfo {
    name: string;
    version_number: string;
    icon_url: string;
}

export interface Dependency {
    project_id: string;
    version_id: string;
}