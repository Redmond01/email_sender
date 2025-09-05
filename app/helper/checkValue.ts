

type ObjectType={
    [key:string]:string;
}
type validationSchema={validation:boolean, message:ObjectType}

export function validateObject(obj:ObjectType):validationSchema {
    // Check if input is an object
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        return {validation:false, message:obj};
    }
    
    // Check each property value
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            
            // Check if value is an empty string or doesn't exist
            if (value === '' || value === null || value === undefined) {
                return {validation:false, message:obj};
            }
        }
    }
    const response:validationSchema={validation:true, message:obj}
    
    return response;
}