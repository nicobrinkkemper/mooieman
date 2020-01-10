import {createUploadBusboy, defaultResults, Config} from './uploadBusboy'
import { Request, ParamsDictionary, NextFunction, Response } from "express-serve-static-core";

type uploadBusboyExpress = (config?: Config) => (request: Request<ParamsDictionary>, response: Response, next: NextFunction) => void
declare global {
    namespace Express {
        interface Request {
            /**
             * All file objects, including a Buffer of the image and the location of the temporary file
             */
            uploads: defaultResults;
            rawBody: any
        }
    }
}
export const uploadBusboyExpress: uploadBusboyExpress = (config = {}) => async (request, response, next) => {
    try {
        request.uploads = await createUploadBusboy(request, config).start()
        next(null)
    } catch (e) {
        next(e)
    }
}
export default uploadBusboyExpress;