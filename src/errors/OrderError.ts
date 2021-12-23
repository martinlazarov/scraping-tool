import {BaseError} from "./BaseError";

export class OrderError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 400, OrderError.name);
    }
}