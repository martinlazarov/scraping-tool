import {BaseError} from "./BaseError";

export class BaseBadRequest extends BaseError {
    constructor(errorString: string) {
        super(errorString, 400, BaseBadRequest.name);
    }
}