import 'dotenv/config'

(async () => {
    const secrets = process.env.AUTHSECRETE
    const secret = new TextEncoder().encode(secrets);

    console.log(secret)

})()
