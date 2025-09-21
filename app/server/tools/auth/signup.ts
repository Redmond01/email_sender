
import { hash } from '@node-rs/bcrypt';
import type { ServerResponse } from '../../../typemodule.js';
import { prismadb } from '../../lib/dbconnection.js';
import { v4 } from 'uuid';
import 'dotenv/config'

export const signup = async (username: string, password: string, uniqueCode: string) => {
    const myEnvAuth = process.env.UNIQUECODE;

    try {
        //compare unique code before moving down to database check
        if (uniqueCode !== myEnvAuth) {
            const response: ServerResponse = { message: 'user not authorized!!', status: 400 }
            return response
        }

        //find if user exist in the database 
        const ifUserExist = await prismadb.user.findFirst({
            where: {
                username: username,
            }
        });

        if (ifUserExist) {
            const response: ServerResponse = { message: 'user already exist in databse', status: 400 }
            return response
        }

        //the password will first be harshed into crypto keys 
        const harshedPassword = await hash(password, 12);

        const createUser = await prismadb.user.create(
            {
                data: { username: username, id: v4(), password: harshedPassword }
            }
        )

        if (createUser) {
            const response: ServerResponse = { message: 'user created', data: createUser, status: 200 }
            return response
        } else {
            const response: ServerResponse = { message: 'failed to create user', status: 400 }
            return response
        }

    } catch (e: any) {
        const response: ServerResponse = { message: e.message, status: 500 }
        return response
    }
}