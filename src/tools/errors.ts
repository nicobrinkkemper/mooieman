
interface HTTPErrorConstructor {
    new(code: number, message?: string, extras?: object);
}
interface HTTPErrorInterface extends Error {
    statusCode: number
    extras: object
}
const STATUS_CODES = { '404': 'NotFound', '500': 'InternalServerError' }

export const HTTPError: HTTPErrorConstructor = class HTTPError extends Error implements HTTPErrorInterface {
    statusCode
    extras
    constructor(code, message, extras) {
        super(message || STATUS_CODES[code]);
        this.extras = extras || {};
        this.statusCode = code;
    }
}
export default HTTPError