import { HTTPCodes } from "./http_codes.enum";

export type Err = {
    message: string;
    status: HTTPCodes;
};

export class ErrorWithStatus extends Error {
    status: HTTPCodes;
    constructor(message: string, status: HTTPCodes) {
        super(message);
        this.status = status;
    }
}

export const isErr = (obj: any): obj is Err => {
    return (obj as Err) !== undefined;
}
