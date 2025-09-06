
import { compare } from '@node-rs/bcrypt';
import { prismadb } from '../../lib/dbconnection';
import type { ServerResponse } from '../../../typemodule'
import { signUserId } from '../../../helper/jwt';
import { generateRefreshToken } from '../../../helper/jwt';


export const authUser = async (username: string, userPpassword: string): Promise<ServerResponse> => {
    try {

        const findUser = await prismadb.email.findMany({
            where: {
                email: username,
            }
        })

        const user = findUser.find(async (uniqueUser) => {
            const { password } = uniqueUser
            const compareHarshed = await compare(userPpassword, password)

            if (compareHarshed) {
                return uniqueUser
            } else {
                return null
            }
        })

        if (user) {
            const accessToken = await signUserId(user.id);
            const { success, refreshToken } = await generateRefreshToken(accessToken)
            const response: ServerResponse =
            {
                message: 'user found',
                status: 200,
                data: {
                    accestoken: accessToken,
                    refreshtoken: refreshToken,
                    status: success
                }
            }
            return response
        } else {
            const response: ServerResponse = { message: 'user not found', status: 400 }
            return response
        }
    } catch (e: any) {
        const response: ServerResponse = { message: 'internal Error', status: 500, data: e.message }
        return response
    }

}
