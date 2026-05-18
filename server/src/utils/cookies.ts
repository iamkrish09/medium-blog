export const COOKIE_NAME = 'krishna_blogging_token';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const getCookieOptions = (isProduction: boolean) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('None' as const) : ('Lax' as const),
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
});