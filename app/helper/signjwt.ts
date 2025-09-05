import { SignJWT } from 'jose';
import 'dotenv/config'

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
