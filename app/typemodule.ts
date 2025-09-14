export interface userRecipient {
    id: string,
    name: string,
    email: string,
    companyName: string,
    noOfEmailSent: number
    userStatus: boolean,
    industry: string,
    emailValid: boolean
    isFirstMail: boolean
}

export type ServerResponse = {
    data?: Record<string, any>,
    message: string,
    status: 200 | 400 | 401 | 500,
    inserted?: number,
    skipped?: number
}

export type SmtpSchema = {
    user: string,
    password: string
}

export type serverRequestConfig = {
    method: string,
    headers: { [key: string]: string },
    data: string,
    withCredentials?: boolean
    url: string
}

export type Response = {
    data?: {} | string,
    message: string,
    status: 200 | 400 | 401 | 500,
    inserted?: number,
    skipped?: number
}

export type CsvDataFormat = Record<string, string>[]

export interface NewData extends userRecipient, Record<string, string | boolean | number> { }

