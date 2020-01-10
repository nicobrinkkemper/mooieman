import { end, lit, int, zero, parse, Route, str } from 'fp-ts-routing'
//
// locations
//

interface Home {
    readonly _tag: 'Home'
}
interface Photo {
    readonly _tag: 'Photo'
    readonly type: 'mooieman' | 'fraaievrouw' | string
    readonly number: number
}

interface Upload {
    readonly _tag: 'Upload'
}

interface User {
    readonly _tag: 'User'
    readonly id: number
}

interface NotFound {
    readonly _tag: 'NotFound'
}

type Location = Home | User | Photo | NotFound | Upload

export const home: Location = { _tag: 'Home' }

export const upload: Location = { _tag: 'Upload' }

export const photo = (type: string, number: number): Location => ({ _tag: 'Photo', type, number })

export const notFound: Location = { _tag: 'NotFound' }

export const user = (id: number): Location => ({ _tag: 'User', id })

// matches
export const defaults = end
export const homeMatch = lit('home').then(end)
export const userIdMatch = lit('users').then(int('userId'))
export const userMatch = userIdMatch.then(end)
export const photoMatch = lit('photo')
    .then(int('number'))
    .then(str('type'))
    .then(end)
export const uploadMatch = lit('upload').then(end)

// routers
export const router = zero<Location>()
    .alt(defaults.parser.map(() => home))
    .alt(homeMatch.parser.map(() => home))
    .alt(userMatch.parser.map(({ userId }) => user(userId)))
    .alt(photoMatch.parser.map(({ type, number }) => photo(type, number)))
    .alt(uploadMatch.parser.map(() => upload))

// helper
export const parseLocation = (s: string): Location => parse(router, Route.parse(s), notFound)

export  default router;