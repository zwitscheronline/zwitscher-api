import { HTTPCodes } from "./http_codes.enum";

export type Err = {
    message: string;
    status: HTTPCodes;
};

export const isErr = (obj: any): obj is Err => {
    return (obj as Err) !== undefined;
}
