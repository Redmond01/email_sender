import type { csvDataFormat} from '../typemodule'

export const modifyStringKeyToValue = (data: csvDataFormat[]) => {
    const entries = data.map((each) => {
        const eachObject = Object.entries(each);
        if (eachObject.length === 0) return {}

        const [key, value] = eachObject[0];

        const keyString = key
    })
}