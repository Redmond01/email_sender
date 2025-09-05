import { jwtVerify } from "jose";
import 'dotenv/config'


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