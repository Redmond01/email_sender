import { jwtVerify, SignJWT } from 'jose';
import type { ServerResponse } from '../typemodule';
import { prismadb } from '../server/lib/dbconnection';



//used to generate refresh token (takes the access token) and generate "refreshtoken"
export async function generateRefreshToken(accessToken: string) {
    const refreshTokenKey = new TextEncoder().encode(process.env.AUTHSECRETE);
    try {
        // Step 1: Verify the access token
        const { payload } = await jwtVerify(accessToken, refreshTokenKey);

        // Step 2: Use the payload (e.g., userId) to create a new refresh token
        const refreshToken = await new SignJWT({ userId: "refreshToken" })
            .setProtectedHeader({ alg: 'HS256' })
            .setSubject(payload.sub as string)
            .setIssuedAt()
            .setExpirationTime('14 days') // Refresh tokens last longer
            .sign(refreshTokenKey);

        return { success: true, refreshToken };
    } catch (error: any) {
        return { success: false, message: 'Invalid or expired access token', error: error.message };
    }                                      
}



//generate accesstoken from the server (client first credentials login)
export async function generateAccessToken(id: string): Promise<string> {
    // Secret key (in production, use a strong secret or a private key)
    const secretKey = new TextEncoder().encode(process.env.AUTHSECRETE);
    // Create and sign the JWT
    const token = await new SignJWT({ sub: "user" }) // payload
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setSubject(id)
        .setExpirationTime('1 day') // expires in 2 hours
        .sign(secretKey)
    return token;
}



//verifies only the access token, that is if the client can provide it.
export async function verifyAccessTokens(token: string): Promise<boolean> {
    // const secretKey = process.env.AUTHSECRETE
    const verifyToken = new TextEncoder().encode(process.env.AUTHSECRETE);

    try {
        await jwtVerify(token, verifyToken);
        return true;
    } catch {
        return false; // Token is invalid or expired
    }
}



//verifies only the refresh token, if the client cant provide (accesstoken) it should provide refresh token.import { jwtVerify } from 'jose';
export async function verifyRefreshToken(refreshToken: string): Promise<ServerResponse> {
    const refreshTokenSecrete = new TextEncoder().encode(process.env.AUTHSECRETE);
    try {
        const { payload } = await jwtVerify(refreshToken, refreshTokenSecrete);
        const userId = payload.sub as string

        //if token is invaaid retun error code of 401
        if (payload.userId !== 'refreshToken') {
            const response: ServerResponse = { message: 'token invalid', status: 401, }
            response
        }

        // check the (subject) attached to the token in the db
        const findUser = await prismadb.user.findMany({
            where: {
                username: userId
            }
        })

        if (!findUser) {
            const response: ServerResponse = { message: 'invalid user token', status: 400, }
            response
        }

        const reGenerateAccssToken = await generateAccessToken(userId)

        return { message: reGenerateAccssToken, status: 200 }
    } catch (err) {
        throw new Error('Invalid or expired refresh token');
    }
}