
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
        compatibleVersions: string[];
        uniqueIdProvider: number;
        modpackVersionId?: string;
        serverId: number;
    };
    bedrockRemote?: {
        address: string;
        port: number;
        coreVersion: string;
        compatibleVersions: string[];
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
    name?: string;
    version_number?: string;
    icon_url?: string;
    file_name?: string;
}

export interface Dependency {
    project_id: string;
    version_id: string;
    file_name: string;
}

export interface JavaRemote {
    address: string;
    port: number;
    coreVersion: string;
    compatibleVersions: string[];
    uniqueIdProvider: number;
    modpackVersionId?: string;
    serverId: number;
}

export interface BedrockRemote {
    address: string;
    port: number;
    coreVersion: string;
    compatibleVersions: string[];
}
export interface Form {
    title: string
    preface: string
    questions: Question[]
}

export interface Question {
    root: {
        content: string
        hint?: string
        required: boolean
    }
    branches:
        ChoiceBranches |
        NumberBranches |
        DateFullBranches |
        DateYearMonthBranches |
        OpenBranches
}

export interface ChoiceBranches {
    type: "choice"
    choices: string[]
    allowMultipleChoices: boolean
    hasBlank: boolean
}

export interface ChoiceResponse {
    chosenIndexes: number[]
    other?: string
}

export interface NumberBranches {
    type: "number"
}

export interface DateFullBranches {
    type: "dateFull"
}

export interface DateYearMonthBranches {
    type: "dateYearMonth"
}

export interface OpenBranches {
    type: "open"
    allowMultipleLines: boolean
}

export type FormResponse = (
    ChoiceResponse |
    string | // for open questions
    number // for number, dateFull and dateYearMonth questions
)[]
