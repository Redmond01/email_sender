import { jwtVerify, SignJWT } from 'jose';
import 'dotenv/config'

/**
 * Verifies the access token and generates a new refresh token
 */


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

