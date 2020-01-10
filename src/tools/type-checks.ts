export const typeOf = <T>(val: T) => Object.prototype.toString.call(val)
export const typeError = <NAME>(name: NAME, fallbackType: string, valType: string, msg?:string) => new TypeError(`${msg ? `\n(${msg})`: ''}${name} should be of type ${fallbackType}, but is: ${valType}`)

export const typeCHeck = <T extends {}>(obj: Partial<T>) => <NAME extends keyof T, F>(name: NAME, fallback: F) => {
    if (!obj.hasOwnProperty(name))
        return fallback
    else if (!obj[name])
        return undefined // allow the disabling of some features by explicitly setting it to some falsey value
    throw (typeError(name, `${typeOf(fallback)} or falsey`, typeOf(obj[name])))
}

// loose properties may be set to a falsey value to disable a specific feature, but must not differ in type otherwise
export const typeCheckFalsey = <T extends {}>(obj: Partial<T>) => <NAME extends keyof T, F>(name: NAME, fallback: F) => {
    if (!obj.hasOwnProperty(name))
        return fallback
    else if (!obj[name])
        return undefined // allow the disabling of some features by explicitly setting it to some falsey value
    throw (typeError(name, `${typeOf(fallback)} or falsey`, typeOf(obj[name])))
}

// strict properties may be set, but must share the type with the fallback property.
export const typeCheckStrict = <T extends {}>(obj: Partial<T>) => <NAME extends keyof T, F>(name: NAME, fallback: F) : T[NAME]|F => {
    if (obj.hasOwnProperty(name)) {
        if (typeOf(fallback) === typeOf(obj[name]))
            return obj[name] as T[NAME]; // this value will do
        else throw (typeError(name, typeOf(fallback), typeOf(obj[name])));
    }
    return fallback
}

// required properties must share it's type with the fallback property and must always be set
export const typeCheckRequire = <T extends {}>(obj: Partial<T>) => <NAME extends keyof T, F>(name: NAME, fallback: F): T[NAME]|F => {
    if (obj.hasOwnProperty(name))
        if (typeOf(fallback) === typeOf(obj[name]))
            return obj[name] as T[NAME]; // this value will do
    throw (typeError(name, typeOf(fallback), typeOf(obj[name])));
}
