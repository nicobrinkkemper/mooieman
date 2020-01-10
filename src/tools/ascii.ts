import asciify = require('asciify-image')
export const logAscii = async (img: Buffer, msg?: string) => {
    console.log(msg)
    console.log(await asciify(img, {
        fit: 'box',
        width: 16,
        height: 16
    }))
};