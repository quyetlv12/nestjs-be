export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    name: string;
    password: string;
    confirmPassword : string
}