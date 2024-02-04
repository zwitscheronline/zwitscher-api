export type AccessTokenData = {
    sub: string;
    email: string;
    userTag: string;
};

export type RefreshTokenData = {
    sub: string;
    tokenVersion: number;
};
