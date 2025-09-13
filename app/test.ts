
(()=>{
    // const ds = {name:'raymond',names:'raymond'}
    // console.log(Object.entries(ds))

    const ds:[string, string][] = [['helo', 'raymond']];

    const [key, value ] = ds[0]

    console.log(key)
})()

// export const modifyStringKeyToValue = (data:[]) => {
//     return data.map((each) => {
//         const eachObject = Object.entries(each);
//         if (eachObject.length === 0) return {}

//         const [key, value] = eachObject[0];

//         const keyString = key.split(',').map((key) => key.trim())
//         const vlaueString = value.split(',').map((value) => value.trim())

//         if (keyString.length !== vlaueString.length) {
//             console.log('key and value dont match')
//         }

//         const result = {}

//         for (let i = 0; i < keyString.length; i++) {
//             result[keyString[i]] = vlaueString[i]
//         }
//         return result
//     })
// }

// console.log(modifyStringKeyToValue([{ 'name, age, school': 'folarin,23,saapade' }]))