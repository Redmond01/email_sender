import { jwtVerify } from "jose";


export async function verifyTokens(token: string): Promise<boolean> {
    const secretKey = process.env.AUTHSECRETE
    if(!secretKey) console.log('secrete key not found');
    const verifyToken = new TextEncoder().encode(secretKey);

    try {
        await jwtVerify(token, verifyToken);
        return true;
    } catch {
        return false; // Token is invalid or expired
    }
}