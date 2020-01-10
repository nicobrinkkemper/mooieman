import { pipe, applySpec } from 'ramda'
import * as image from './image'
import * as crud from './crud'
import App from './extendedApp'
// or
// import App from './mapped'

export const Image = applySpec(image)


export default pipe(
    App,
    (app) => {
        const File = app.storage()()
        const collection = app.firestore()
        const Stats = collection('stats')
        return {
            ...app,
            Stats,
            Image: pipe(
                collection('images'),
                crud.newCrud(Stats),
                applySpec(
                    applySpec(image)(File)
                ),
            )
        }
    },
);