export interface LoginCredentials {
    email: string;
    password: string;
}

export interface UserData {
    id: number;
    email: string;
    name: string;
    role: string;
}

export interface AuthResponse {
    access_token: string;
    admin: UserData;
}

export interface TokenVerifyResponse {
    valid: boolean;
}

export interface TokenRefreshResponse {
    access: string;
} 