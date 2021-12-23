// injects the user object in express requests
declare namespace Express {
    export interface Request {
       user?: any
    }
}