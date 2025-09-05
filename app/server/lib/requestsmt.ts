import type {SmtpSchema} from '../typemodule.js';
import 'dotenv/config'

export const requestsmtps = ()=>{
    const newArray: SmtpSchema[] = []
    const getCredentials = Object.keys(process.env)
        .filter(keys => keys.startsWith("EMAIL_"));

    for (let i = 0; i < getCredentials.length; i++) {
        const getRecipients = process.env[getCredentials[i]] as string
        const redefindEmails = JSON.parse(getRecipients)
        newArray.push(redefindEmails)
    }
    return newArray

}

