/**
 * This file is a standalone utility for uploading files with the uploadBusboy library.
 * Busboy is a parser that reads all uploaded files. Through configuration it is possible
 * to 
 * 
 * 
 * Notes for reading this code: 
 * - Every function is extensively typed. Each function respects it's definition written above it without unneccerary typecasting.
 * - Types from the config object should and will be reflected wherever you'd expect. This did require a lot of explaining to typescript. This is fine, because
 *      it means explicit output for end-users of this utility.
 * - HOC (Higher Order Functions) are prefixed with 'create'
 * - Every function has a comment, these should show up when hovering over these types with something like vscode
 * - The only (non-native) dependency is `busboy`
 */

/** Generic function used together with extends */
type AnyFunction = (...args: any[]) => any

/** Trick that turns `A | B | C` to `A & B & C` */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/** Combined functions of array as one function */
type combinedCreatorArr<O extends Array<AnyFunction>> = (...args: Parameters<O[number]>) => UnionToIntersection<ReturnType<O[number]>>

type createUnifiedFunction = <O extends Array<AnyFunction>>(...fns: O) => combinedCreatorArr<O>
/** Returns a function that recursively calls all functions in a array -with the same arguments- and combines results */
const createUnifiedFunction: createUnifiedFunction = (...fns) => fns.reduce(
    (prev: any, creator: any) => (...args: any[]) => Object.assign(prev(...args), creator(...args))
    , () => ({})
)

/** A unified type of two objects*/
type merged<y, x> = {
    [k in (keyof y | keyof x)]: k extends keyof x
    ? x[k]
    : k extends keyof y ? y[k]
    : never
}
type merge = <x, y>(y: y, x: x) => merged<y, x>
/** Merge two objects and cast to a more readable type definition (seen when hovering over things) */
const merge: merge = (y, x) => Object.assign(y, x) as merged<typeof y, typeof x>

/** 
 * Adds the ability to call a function without arguments which will return the history of the function.
 * This makes the function impure and thus hard for Typescript to reason about, but it does add some cool functionality,
 * namely state. This impurity is eleviated by typecasting to the original function(s) (meaning the function passed in to the store function)
 */
type store<T extends AnyFunction> = {
    (...funcArgs: Parameters<T>): ReturnType<T>
    (): { [k: string]: ReturnType<T>[] }
}

/**
 * Upgrades a function to store and list all previous results.
 * 
 * @remarks
 * The upgraded function will behave like the original when called with arguments, but will list a object
 * containing all previous results when called without arguments. Each result
 * will be keyed by their first argument, which must always be a string. A key can have multiple
 * results, which is why all results are createStored in a array.
 * ```ts
 * const create = (fieldname,value)=>({[fieldname]:value})
 * const myStore = createStore(create)
 * myStore('A','some')
 * myStore('B','values')
 * console.log(myStore('A','thing')) // {A:'thing'}
 * console.log(myStore()) // { A: [{A:'some'},{A:'thing'}], B: [{B:'values'}] }
 * ```
 */
type createStore = <T extends AnyFunction>(func: T) => store<T>
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
type wrappedStore<O extends { [k: string]: any }> = { [k in keyof O]: store<O[k]> }

/**
 * Wraps all values of a object in a store type
 * todo: make the store function generic somehow, this is hard
 * because our store function has two signatures (with and without parameters)
 */
type wrapStore = <T extends AnyFunction, O extends { [k: string]: any }>(func: T, obj: O) => wrappedStore<O>
const _wrapStore: wrapStore = (func, obj) =>
    Object.entries(obj)
        .reduce(
            (prev, [key, value]) => Object.assign(prev, { [key]: func(value) }),
            <typeof obj>{}
        )

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
type fileWritesCreate = ({ tmpdir, tmpname }: merged<utils, any>) => fileWrites
const _fileWritesCreate: fileWritesCreate = ({ tmpdir, tmpname }) => {
    const fs = require('fs');
    const path = require('path');
    return (...args) => ({
        destination: new Promise((resolve, reject) => {
            const destination = path.join(tmpdir(...args), tmpname(...args));
            const writeStream = fs.createWriteStream(destination);
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

/** default temporary directory used for fileWrites */
type tmpdir = AnyFileFunction<string>;

/** default temporary filename used for fileWrites */
type tmpname = AnyFileFunction<string>;


/** The utilities for fileWriteCreate */
type utils = {
    tmpdir: tmpdir
    tmpname: tmpname,
}

/** the default configuration of createUploadBusboy */
export type ConfigDefaults = {
    createStore: createStore
    wrapStore: wrapStore
    newBusboy: newBusboy
    utils: utils
    onFile: onFile
    onField: onField
};

/** the configuration given by a programmer */
export type Config = {
    createStore?: createStore
    wrapStore?: wrapStore
    newBusboy?: newBusboy
    utils?: { [k: string]: AnyFunction }
    onFile?: { [k: string]: AnyFileFunction<object> }
    onField?: { [k: string]: AnyFieldFunction<object> }
}



/** A accurate definition of merged config, reflects any possible configuration */
export type mergedConfig<C extends Config> = {
    createStore: C['createStore'] extends createStore ? C['createStore'] : createStore
    wrapStore: C['wrapStore'] extends wrapStore ? C['wrapStore'] : wrapStore
    newBusboy: C['newBusboy'] extends newBusboy ? C['newBusboy'] : newBusboy
    utils: merged<utils, (C["utils"] extends functionObject ? C["utils"] : {})>
    onFile: merged<onFile, (C["onFile"] extends functionObject ? C["onFile"] : {})>
    onField: merged<onField, (C["onField"] extends functionObject ? C["onField"] : {})>
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
    createStore: C['createStore'] | createStore
    wrapStore: C['wrapStore'] | wrapStore
    newBusboy: C['newBusboy'] | newBusboy
    utils: C['utils'] | utils
    onFile: C['onFile'] | onFile
    onField: C['onField'] | onField
}

type mergeConfig = <C extends Config>(config?: C) => mergedConfig<C>
/** Assigns all the default functions to the config object */
const mergeConfig: mergeConfig = (config = {} as any) => {
    if (!isFunctionObject(config.utils)) throw (fnsOnlyErr('utils'))
    if (!isFunctionObject(config.onFile)) throw (fnsOnlyErr('onFile'))
    if (!isFunctionObject(config.onField)) throw (fnsOnlyErr('onField'))
    const utils = merge(
        <utils>{
            tmpname: (_, __, filename) => filename,
            tmpdir: require('os').tmpdir
        },
        config.utils || {}
    );
    return {
        onField: merge(
            <onField>{
                fields: _fields
            },
            config.onField || {}
        ),
        onFile: merge(
            <onFile>{
                fileWrites: _fileWritesCreate(utils),
                fileBuffers: _fileBuffers,
                files: _files
            },
            config.onFile || {}
        ),
        utils,
        newBusboy: typeof config.newBusboy === 'function' ? config.newBusboy : _newBusboy,
        wrapStore: typeof config.wrapStore === 'function' ? config.wrapStore : _wrapStore,
        createStore: typeof config.createStore === 'function' ? config.createStore : _createStore
    } as simpleMergedConfig<typeof config> as mergedConfig<typeof config>
}


/** infers the return type of a Promise */
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type newBusboy = (busboyConfig: busboy.BusboyConfig) => busboy.Busboy;
/** creates a new instance of busboy class */
const _newBusboy: newBusboy = busboyConfig => new (require('busboy'))(busboyConfig)

/** infers the return type of Promises attached to a object */
type resolved<T extends any> = { [s in keyof T]: UnpackPromise<T[s]>; }

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
export type defaultResults = resolved<ReturnType<onFileMergedConf<{}>>[]>

/** The combination of default onFile configuration and the onFile configuration given by a end-user, if any */
type onFileMergedConf<ONFILE extends { [k: string]: AnyFileFunction<any> }> = combinedCreatorArr<(AnyFileFunction<{
    destination: Promise<string>;
    buffer: Promise<Buffer>;
    fieldname: string;
    file: NodeJS.ReadableStream;
    filename: string;
    encoding: string;
    mimetype: string;
}>)[]>
/** The combination of default onFile configuration and the onFile configuration given by a end-user, if any */
type onFieldMergedConf<ONFIELD extends { [k: string]: AnyFieldFunction<any> }> = combinedCreatorArr<AnyFieldFunction<{
    fieldname: string;
    val: any;
    fieldnameTruncated: boolean;
    valTruncated: boolean;
    encoding: string;
    mimetype: string;
}>[]>

/** The api facing a end-user of createUploadBusboy, this the returnType of createUploadBusboy */
type api<C extends Config, MC extends mergedConfig<any>> = {
    busboy: busboy.Busboy
    onFile: store<onFileMergedConf<MC['onFile']>>
    onField: store<onFieldMergedConf<MC['onField']>>, 
    utils: MC['utils']
    start: start<MC>
} & wrappedStore<MC['onField']> & wrappedStore<MC['onFile']> & start<MC>

/** The start function with and without callback */
type start<MC extends mergedConfig<any>> = {
    <CB extends ((done: resolved<ReturnType<onFileMergedConf<MC['onFile']>>>) => any)>(cb: CB): Promise<resolved<ReturnType<CB>[]>>
    (): Promise<resolved<ReturnType<onFileMergedConf<MC['onFile']>>>[]>
}

type createApi = <R extends { rawBody: any, headers: object }, C extends Config, MC extends mergedConfig<C>>(request: R, config: MC) => api<C, MC>
/** Generete the api facing a end-user of this utility. This is the interface of the program.
 *  The api/interface is actually just a function, but also has uttility functions attached to it; think "callable object" */
export const createApi: createApi = (request, config) => {
    const { utils, newBusboy, onField, onFile, createStore, wrapStore } = config
    /** some busboy logic, the newBusboy function may be from config */
    const busboy = newBusboy({ headers: request.headers })
    /** onFile is extendable through config */
    const onFileSubStores = wrapStore(
        createStore,
        onFile
    )
    /** onFile is a function that stores the combination of all substores */
    const handleOnFile = createStore(
        createUnifiedFunction(
            /**  
             * Don't use substores ReturnTypes because the two function signatures of store will obvuscate the function signature.
             * However, we still want to give it as a parameter, as this will populate our substores
            */
            ...Object.values(onFileSubStores as unknown as onFile)
        )
    )

    /** fields have the same logic as files. Eventhough there is just one default function, additional ones could be configured */
    const onFieldSubStores = wrapStore(
        createStore,
        onField
    )
    const handleOnField = createStore(
        createUnifiedFunction(
            ...Object.values(onFieldSubStores as unknown as onField)
        )
    )
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
        utils,
        onField: handleOnField,
        start
    })
}

/**
 * This is the main/default function and returns
 * the api/interface upon receiving the request object and a optional configuration object.
 */
export type createUploadBusboy = <
    R extends { rawBody: any, headers: object },
    C extends Config
    >(
    request: R,
    config?: C,
) => api<C, mergedConfig<C>>
export const createUploadBusboy: createUploadBusboy = (request, config) => createApi(request, mergeConfig(config))

export default createUploadBusboy