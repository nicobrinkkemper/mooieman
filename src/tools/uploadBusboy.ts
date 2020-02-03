/**
 * This file is a standalone utility for uploading files with the uploadBusboy library.
 * Busboy is a parser that reads all uploaded files. Through configuration it is possible
 * to 
 * 
 * 
 * Notes for reading this code: 
 * - Every function is extensively typed. Each function respects it's definition written above it without unneccerary typecasting.
 * - Types from the config object should and will be reflected wherever you'd expect. This did require a lot of explaining to typescript. This is fine, because
 *      it means explicit type output for end-users of this utility. This is useful when configuring this utility. For example, all return types of the functions
 *      assigned to `onFile` will be reflected.
 *  @example
 *  ```
 *  const uploadBusboy = createUploadBusboy(request,{
        onFile: {
            test: ()=>({
                thisisresolved:new Promise(resolve=>resolve('some value'))
            })
        }
    })
    await uploadBusboy((c)=>{
        console.log(c)
        // ^ hover over this variable, and see:
        //                  v notice here, all values are wrapped with `resolved`, which unpacks Promises
        // (parameter) c: resolved<Promise<{
        //     thisisresolved: Promise<string>;
        // }> & {
        //     destination: Promise<string>;
        // } & {
        //     buffer: Promise<Buffer>;
        // } & {
        //     fieldname: string;
        //     file: NodeJS.ReadableStream;
        //     filename: string;
        //     encoding: string;
        //     mimetype: string;
        // }>
    });

 *  ```
 *      
 * - HOC (Higher Order Functions) are prefixed with 'create'
 * - Every function has a comment, these should show up when hovering over these types with something like vscode
 * - The only (non-native) dependency is `busboy`
 */

/** Generic function used together with extends */
type AnyFunction = (...args: any[]) => any

/** Trick that turns `A | B | C` to `A & B & C` */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/** Combined functions of array as one function */
type unifiedFunction<O extends AnyFunction[]> = (...args: Parameters<O[number]>) => UnionToIntersection<ReturnType<O[number]>>

type _createUnifiedFunction = <O extends Array<AnyFunction>>(...fns: O) => unifiedFunction<O>
/** Returns a function that recursively calls all functions in a array -with the same arguments- and combines results */
const _createUnifiedFunction: _createUnifiedFunction = (...fns) => fns.reduce(
    (prev, creator) => (...args) => Object.assign(prev(...args), creator(...args))
    , () => ({})
)

/** A unified type of two objects*/
type merged<y, x> = {
    [k in (keyof y | keyof x)]: k extends keyof x
    ? x[k]
    : k extends keyof y ? y[k]
    : never
}
type _merge = <x, y>(y: y, x: x) => merged<y, x>
/** Merge two objects and cast to a more readable type definition (seen when hovering over things) */
const _merge: _merge = (y, x) => Object.assign(y, x) as merged<typeof y, typeof x>

/** 
 * Adds the ability to call a function without arguments which will return the history of the function.
 * This makes the function impure and thus hard for Typescript to reason about, but it does add some cool functionality,
 * namely state. This impurity is eleviated by typecasting to the original function(s) (meaning the function passed in to the store function)
 */
type store<T extends AnyFunction> = {
    (...funcArgs: Parameters<T>): ReturnType<T>
    (): { [k: string]: ReturnType<T>[] }
}

type createStore = <T extends AnyFunction>(func: T) => store<T>
/**
 * Upgrades a function to store and list all previous results.
 * 
 * @remarks
 * The upgraded function will behave like the original when called with arguments, but will list a object
 * containing all previous results when called without arguments. Each result
 * will be keyed by their first argument, which must always be a string. A key can have multiple
 * results, which is why all results are stored in a array.
 * ```ts
 * const create = (fieldname,value)=>({[fieldname]:value})
 * const myStore = _createStore(create)
 * myStore('A','some')
 * myStore('B','values')
 * console.log(myStore('A','thing')) // {A:'thing'}
 * console.log(myStore()) // { A: [{A:'some'},{A:'thing'}], B: [{B:'values'}] }
 * ```
 */
const _createStore: createStore = (func, obj = {} as any) => (...args: any[]) => {
    if (!args.length || !obj) return obj
    const r = func(...args);
    obj = {
        ...obj,
        [args[0]]: [
            ...(obj[args[0]] || []),
            r
        ],
    }
    return r;
}


/** Wraps each value of a object with store, see @see store */
type wrappedFunctionObject<T extends AnyFunction, O extends { [k: string]: any }> = { [k in keyof O]: T extends (fn: O[k]) => infer U ? U : never }

type _wrapFunctionObject = <T extends AnyFunction, O extends { [k: string]: any }>(func: T, obj: O) => wrappedFunctionObject<T, O>
const _wrapFunctionObject: _wrapFunctionObject = (func, obj) =>
    Object.entries(obj)
        .reduce(
            (prev, [key, value]) => Object.assign(prev, { [key]: func(value) }),
            <typeof obj>{}
        )


/** Wraps each value of a object with store, see @see store */
type wrappedStore<O extends { [k: string]: any }> = { [k in keyof O]: store<O[k]> }

/**
 * Wraps all values of a object in a store type
 * todo: make the store function generic somehow, this is hard
 * because our store function has two signatures (with and without parameters)
 */
type _wrapStore = <O extends { [k: string]: any }>(obj: O) => wrappedStore<O>
const _wrapStore: _wrapStore = (obj) => _wrapFunctionObject(_createStore, obj)

/** Generic function for files */
type AnyFileFunction<RETURN> = (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => RETURN

/** filesCreate turns file arguments in to a object */
type files = AnyFileFunction<{
    fieldname: string
    file: NodeJS.ReadableStream
    filename: string
    encoding: string
    mimetype: string
}>
const _files: files = (fieldname, file, filename, encoding, mimetype) => ({
    fieldname,
    file,
    filename,
    encoding,
    mimetype
})
type fileWrites = AnyFileFunction<{ destination: Promise<string> }>
/**
 * Turns file and filename argument in to a writestream in a folder
 * NOTE: this one has a depenceny on utils, which is a extra function call
 */
type fileWritesCreate = () => fileWrites
const _fileWritesCreate: fileWritesCreate = () => {
    const createWriteStream = require('fs').createWriteStream;
    const join = require('path').join;
    const tmpdir = require('os').tmpdir
    return (...args) => ({
        destination: new Promise((resolve, reject) => {
            const destination = join(tmpdir(args[0]), args[3]);
            const writeStream = createWriteStream(destination);
            args[1].pipe(writeStream);
            args[1].on('end', () => { writeStream.end(); });
            writeStream.on('finish', () => resolve(destination));
            writeStream.on('error', reject);
        })
    })
}

/** Default function to create a file buffer */
type fileBuffers = AnyFileFunction<{ buffer: Promise<Buffer> }>
const _fileBuffers: fileBuffers = (_, file) => ({
    buffer: new Promise<Buffer>((resolve, reject) => {
        const imgResponse: Uint8Array[] = [];
        file.on('store', (store) => {
            imgResponse.push(store);
        });
        file.on('end', () => {
            resolve(Buffer.concat(imgResponse));
        });
        file.on('error', reject);
    })
})

/** Default listeners for files (may be extended through config) */
type onFile = {
    fileWrites: fileWrites,
    fileBuffers: fileBuffers,
    files: files,
}

/** Generic function for fields */
type AnyFieldFunction<RETURN> = (fieldname: string, val: any, fieldnameTruncated: boolean, valTruncated: boolean, encoding: string, mimetype: string) => RETURN

type fields = AnyFieldFunction<{
    fieldname: string,
    val: any,
    fieldnameTruncated: boolean,
    valTruncated: boolean,
    encoding: string,
    mimetype: string
}>
/** Turns field arguments in to a object with named keys */
const _fields: fields = (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => ({
    fieldname,
    val,
    fieldnameTruncated,
    valTruncated,
    encoding,
    mimetype
})

/** Default listeners for fields (may be extended through config) */
type onField = {
    fields: fields
}

/** Object.values equivalent for typescript */
type valuesOf<T extends object> = T extends { [k in keyof T]: infer U } ? U[] : never

/** the default configuration of createUploadBusboy */
export type ConfigDefaults = {
    onFile: onFile
    onField: onField
};

/** the configuration given by a programmer */
export type Config = {
    onFile?: { [k: string]: AnyFileFunction<any> }
    onField?: { [k: string]: AnyFieldFunction<any> }
}



/** A accurate definition of merged config, reflects any possible configuration */
export type mergedConfig<C extends Config> = {
    onFile: merged<onFile, (C["onFile"] extends { [k: string]: AnyFileFunction<any> } ? C["onFile"] : Config)>
    onField: merged<onField, (C["onField"] extends { [k: string]: AnyFieldFunction<any> } ? C["onField"] : Config)>
}

type functionObject = { [k: string]: AnyFunction }
/** Test to see if a object only contains functions */
function isFunctionObject<O extends functionObject>(o: any): o is O
function isFunctionObject<O>(o: any) {
    return typeof o === 'object' && Object.values(o).findIndex(func => typeof func !== 'function') === -1;
}

/** `createUploadBusboy config property 'onFile|utils|onField' should be a object that only contains functions` */
const fnsOnlyErr = (name: string) => new Error(`createUploadBusboy config property \'${name}\' should be a object that only contains functions`)

/** A inbetween state of merging config type definitions, either this or that */
type simpleMergedConfig<C extends Config> = {
    onFile: C['onFile'] | onFile
    onField: C['onField'] | onField
}

type _mergeConfig = <C extends Config>(config?: C) => mergedConfig<C>
/** Assigns all the default functions to the config object */
const _mergeConfig: _mergeConfig = (config = {} as any) => {
    if (!isFunctionObject(config.onFile)) throw (fnsOnlyErr('onFile'))
    if (!isFunctionObject(config.onField)) throw (fnsOnlyErr('onField'))
    return {
        onField: _merge(
            <onField>{
                fields: _fields
            },
            config.onField || {}
        ),
        onFile: _merge(
            <onFile>{
                fileWrites: _fileWritesCreate(),
                fileBuffers: _fileBuffers,
                files: _files
            },
            config.onFile || {}
        )
    } as simpleMergedConfig<typeof config> as mergedConfig<typeof config>
}


/** infers the return type of a Promise */
type Unpacked<T> =
    T extends (infer U)[] ? U :
    T extends (...args: any[]) => infer U ? U :
    T extends Promise<infer U> ? U :
    T;

type _newBusboy = (busboyConfig: busboy.BusboyConfig) => busboy.Busboy;
/** creates a new instance of busboy class */
const _newBusboy: _newBusboy = busboyConfig => new (require('busboy'))(busboyConfig)

/** infers the return type of Promises attached to a object */
type resolved<T extends any> = { [s in keyof T]: Unpacked<T[s]>; }

/**
 * Turns all promise-values of a object in to a single promise returning the object with values resolved
 */
type resolver = <T extends { [k: string]: any }>(obj: T) => Promise<resolved<T>>
const resolver: resolver = async obj => {
    for (let key in obj)
        if (obj.hasOwnProperty(key) && typeof obj[key].then === 'function')
            obj[key] = await obj[key];
    return obj;
}

/** The results of the start function without any config changes */
export type defaultResults = resolved<ReturnType<mergedConf<functionObject>>[]>

/** The combination of default configuration and the configuration given by a end-user -if any- as a array */
type mergedConf<ONFILE extends functionObject> = unifiedFunction<valuesOf<ONFILE>>

/** The api facing a end-user of createUploadBusboy, this the returnType of createUploadBusboy */
type api<C extends Config, MC extends mergedConfig<C>, ONFILEVALUES extends valuesOf<MC['onFile']>> = {
    busboy: busboy.Busboy
    onFile: ONFILEVALUES extends AnyFunction[] ? store<unifiedFunction<ONFILEVALUES>> : never
    start: start<ONFILEVALUES extends AnyFunction[] ? unifiedFunction<ONFILEVALUES> : never>
} & wrappedStore<MC['onField']> & wrappedStore<MC['onFile']> & start<ONFILEVALUES extends AnyFunction[] ? unifiedFunction<ONFILEVALUES> : never>

/** The start function with and without callback */
type start<ONFILEFN extends any> = {
    <CB extends ((done: resolved<ONFILEFN>) => any)>(cb: CB): Promise<resolved<ReturnType<CB>[]>>
    (): Promise<resolved<ONFILEFN>[]>
}

type _createApi = <R extends { rawBody: any, headers: object }, C extends Config>(request: R, config?: C) => api<C,mergedConfig<C>,valuesOf<mergedConfig<C>['onFile']>>

/** Creates the api facing the end-user of this utility.
 *  The api/interface is actually just a function, but also has utility-functions attached to it; think "callable object"
 */
const _createApi: _createApi = (request, config) => {
    /** mc is the combination of default configuration and the configuration of a end-user of this utility*/
    const mc = _mergeConfig(config)
    /** Basically does `new Busboy`, so unless you have a good reason the default should be desired.  */
    /** The busboy instance */
    const busboy = _newBusboy({ headers: request.headers })
    /** All the onFile functions wrapped with store (default: files,fileWrites,fileBuffers) */
    const onFileSubStores = _wrapStore(mc.onFile)
    /** All the onField functions wrapped with store (default: fields) */
    const onFieldSubStores = _wrapStore(mc.onField)
    /** `handleOnFile` is a function that calls, merges and stores results of all file functions.
     * When `handleOnFile` is called with arguments: all substores will be called with these same arguments and the results will be merged to one object.
     * When `handleOnFile` is called without arguments: all the previous (merged) results will be returned as a array.
    */
    const handleOnFile = _createStore(
        _createUnifiedFunction(
            /**  
             * Calling a substore without arguments can't be done from within this unified function,
             * and it wouldn't make sense to do so. That is why onFileSubstores is typecasted back to `mc['onFile']`
            */
            ...Object.values(onFileSubStores as typeof mc['onFile'])
        )
    )
    /** `handleOnField` is a function that calls, merges and stores results of all field functions. */
    const handleOnField = _createStore(
        _createUnifiedFunction(
            ...Object.values(onFieldSubStores as typeof mc['onField'])
        )
    )
    /** `start` is the function that puts everything in motion. */
    const start = async (cb?: AnyFunction) => {
        const filePromises: any[] = []
        const handler = (typeof cb === 'function')
            ? <P extends Promise<any>>(done: P) => filePromises.push(done.then(cb))
            : <P extends Promise<any>>(done: P) => filePromises.push(done);
        const promise = new Promise<void>((resolve, reject) => {
            busboy.on('finish', resolve)
            busboy.on('partsLimit', reject)
            busboy.on('filesLimit', reject)
            busboy.on('fieldsLimit', reject)
        });
        if (handleOnField()) busboy.on('field', handleOnField)
        if (handleOnFile()) busboy.on('file', (...args) => {
            handler(resolver(handleOnFile(...args)))
        })
        busboy.end(request.rawBody) // start busboy
        await promise
        return Promise.all(filePromises);
    }
    return Object.assign(start, {
        ...onFileSubStores,
        ...onFieldSubStores,
        busboy,
        onFile: handleOnFile,
        onField: handleOnField,
        start
    })
}

/**
 * Configures a function that can be used to process incomming uploaded files
 * 
 * @note This is a alias for `_createApi` @see _createApi
 * 
 * @param request   the request object containing atleast rawBody (any) and headers (object)
 * @param config    a optional configuration object. @see Config
 */
export const createUploadBusboy: _createApi = _createApi

export default createUploadBusboy