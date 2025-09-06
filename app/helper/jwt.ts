import { jwtVerify, SignJWT } from 'jose';


export async function generateRefreshToken(accessToken: string) {
    const refreshTokenSecrete = process.env.AUTHSECRETE;
    const refreshTokenKey = new TextEncoder().encode(refreshTokenSecrete);
    try {
        // Step 1: Verify the access token
        const { payload } = await jwtVerify(accessToken, refreshTokenKey);

        // Step 2: Use the payload (e.g., userId) to create a new refresh token
        const refreshToken = await new SignJWT({ userId: payload.userId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('14 days') // Refresh tokens last longer
            .sign(refreshTokenKey);

        return { success: true, refreshToken };
    } catch (error: any) {
        return { success: false, message: 'Invalid or expired access token', error: error.message };
    }
}

export async function signUserId(id: number) {
    // Secret key (in production, use a strong secret or a private key)
    const secret = process.env.AUTHSECRETE
    const secretKey = new TextEncoder().encode(secret);
    // Create and sign the JWT
    const token = await new SignJWT({ id }) // payload
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1 day') // expires in 2 hours
        .sign(secretKey);

    return token;
}

export async function verifyTokens(token: string): Promise<boolean> {
    const secretKey = process.env.AUTHSECRETE
    const verifyToken = new TextEncoder().encode(secretKey);

    try {
        await jwtVerify(token, verifyToken);
        return true;
    } catch {
        return false; // Token is invalid or expired
    }
}