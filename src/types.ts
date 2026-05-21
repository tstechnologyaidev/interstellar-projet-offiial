
export interface NewsItem {
    id: string;
    title: string;
    content: string;
    date: string;
}

export interface Rank {
    id: string;
    name: string;
    description: string;
    icon: string;
    perks: string[];
}

export interface TeamMember {
    id: string;
    username: string;
    role: string;
    avatar: string;
}

export interface ServerSettings {
    discordLink: string;
    serverIp: string;
}

export interface User {
    username: string;
    isAdmin: boolean;
}
