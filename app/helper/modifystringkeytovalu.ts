import type { csvDataFormat } from '../typemodule'

export const modifyStringKeyToValue = (data: csvDataFormat[]) => {
    return data.map((each) => {
        const eachObject = Object.entries(each);
        if (eachObject.length === 0 || !eachObject) return {}
        if (!eachObject) return { msg: "object not found" }

        const testObjectAvailability = eachObject[0];

        if (testObjectAvailability) {
            const [key, value] = testObjectAvailability

            const keyString = key.split(',').map((key: string) => key.trim())
            const vlaueString = value.split(',').map((value: string) => value.trim())

            if (keyString.length !== vlaueString.length) {
                console.log('key and value dont match')
            }
            const result = {}

            for (let i = 0; i < keyString.length; i++) {
                result[keyString[i]] = vlaueString[i]
            }
            return result

        }





    })
}