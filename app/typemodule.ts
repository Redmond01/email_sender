export interface userRecipient {
    id?: number,
    name: string,
    email: string,
    companyName: string,
    noOfEmailSent: number
    userStatus: boolean,
    industry: string,
    emailValid: boolean
}

export type ServerResponse = {
    data?: Record<string , any>,
    message: string,
    status: 200 | 400 | 500,
    inserted?: number,
    skipped?: number
}

export type SmtpSchema = {
    user: string,
    password: string
}

export type serverRequestConfig={
    method:string,
    headers:{[key:string]:string},
    data:string,
    withCredentials?:boolean
    url:string
}