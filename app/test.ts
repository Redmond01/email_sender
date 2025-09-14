interface userRecipient {
    id?: number,
    name: string,
    email: string,
    companyName: string,
    noOfEmailSent: number
    userStatus: boolean,
    industry: string,
    emailValid: boolean
    isFirstMail: boolean
}
interface NewData extends userRecipient, Record<string, string | boolean | number> { }
(() => {
    const ds = [
        {
            'name,email,companyName,industry': 'raymond,Raymond@me.com,rayCo,construction '
        },
        {
            'name,email,companyName,industry': 'seyi,seyi@she.com,seyistiches.inc,art'
        }
    ]



    const result = ds.map((each):userRecipient[] | unknown => {
        const getTemplate = Object.entries(each);

        const nextLayer = getTemplate[0]

        if (!nextLayer) return 'no array to work with'

        //at the layer of each array where all the key are in an array and the value are in the next array
        //meaning [[key in index 0], [value in index 1]]
        //so destructuring each array without calling for the (nextlayer[index number]) to get either
        //key or valu
        const [key, value] = nextLayer




        // the result of the above gives us the following, we now have array of keys and array of values
        const splitKey = key.split(',')
        const splitValue = value.split(',')


        //now we will compare the length of the array of keys and array of values together, if same(true)
        //we will proceed to the with matching the each key in the terms of index[n] and index[n] using
        //the for lop

        if (splitKey.length !== splitValue.length) return 'the length of key dont match the length of value'

        if (!splitKey && splitValue) return 'no array to work with'

        const results: Record<string, any> = {}


        for (let i = 0; i < splitKey.length; i++) {
            results[splitKey[i]] = splitValue[i];
        }

        const dss: NewData = {
            userStatus: true, emailValid: true, isFirstMail: false, email: results.email, companyName: results.companyName,
            noOfEmailSent: 0, name: results.name, industry: results.industry
        }
        return dss
    })

    console.log(result)
})()





