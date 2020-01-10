import { typeCheckRequire, typeCheckStrict } from "~tools/type-checks"
import { Bucket } from "./storage";
import { Duplex, Writable } from "stream";
import { crud } from "./crud";
import { pipe, then, pipeWith, isNil, curry } from "ramda"
import {type,number,string,object} from 'io-ts'

interface Version {
    md5: string,
    fileName: string,
    filePath: string,
    fileMime: string,
    ext: string,
    width: number,
    height: number,
    upload: Buffer | Duplex,
}
const Version = type({
    md5: string,
    fileName: string,
    filePath: string,
    fileMime: string,
    ext: string,
    width: number,
    height: number,
    upload: object,
})

interface Image extends Version {
    originalFileName: string,
    originalFilePath: string,
    originalFileMime: string,
    score: number,
    type: string,
    number: number,
}

const validateVersion = <DATA extends Version>(mode = typeCheckRequire) => (data: Partial<DATA>) => {
    const strictness = mode(data)
    strictness('md5', '')
    strictness('fileName', '')
    strictness('filePath', '')
    strictness('fileMime', '')
    strictness('ext', '')
    return data as DATA;
}
const validateImage = <DATA extends Image>(mode = typeCheckRequire) => {
    const ver = validateVersion(mode)
    return (data: Partial<DATA>) => {
        ver(data)
        const strictness = mode(data)
        strictness('originalFileName', '')
        strictness('originalFilePath', '')
        strictness('originalFileMime', '')
        return data as DATA;
    }
}
const validateCreateImage = validateImage()
const validatePartialImage = validateImage(typeCheckStrict)
const validateCreateVersion = validateVersion()
const validatePartialVersion = validateVersion(typeCheckStrict)

const pipeWhileNotNil = pipeWith((f, res?) => isNil(res) ? res : f(res));
const handleStream = (bucket: Bucket) => async (image: Version): Promise<Omit<Version, 'upload'>> => {
    const writeStream: Writable = bucket(image.filePath).createWriteStream({ contentType: image.fileMime });
    const { upload, ...restImage } = image
    if (Buffer.isBuffer(upload))
        writeStream.end(upload)
    else if (typeof upload.read === 'function')
        writeStream.pipe(upload)
    else
        throw (new TypeError('no upload'))
    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
        writeStream.on('info', info => {
            console.log('info', Object.keys(info))
            if (info.width)
                image.width = info.width
            if (info.height)
                image.height = info.height
        })
    })
    return restImage;
}

export const getCount = (bucket: Bucket) => (crud: crud) => async (data: Omit<Image, 'number'>) => ({
    ...data,
    number: await crud.getCount()
})

export const create = (bucket: Bucket) => (crud: crud) =>
    pipe(
        getCount(bucket)(crud),
        then(
            pipe(
                validateCreateImage,
                handleStream(bucket),
                crud.create
            )
        )
    )

export const createVersion = (bucket: Bucket) => (crud: crud) =>
    pipe(
        validateCreateVersion,
        handleStream(bucket),
    )

export const read = (bucket: Bucket) => (crud: crud) =>
    pipeWhileNotNil([
        crud.read,
        then(pipe(
            validatePartialImage,
            image => ({
                file: bucket(`${image.type}/${image.type}${image.number}.${image.ext || 'webp'}`),
                ...image,
            })
        ))
    ])

export const update = (bucket: Bucket) => (crud: crud) =>
    pipe(
        validatePartialImage,
        crud.update,
    )

const remove = (bucket: Bucket) => (crud: crud) => crud.delete
export { remove as delete }



export default read