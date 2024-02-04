import { Err } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";

export const validateID = (id: number): Err|null => {
    if (id < 1) {
        return {
            message: "Invalid ID",
            status: HTTPCodes.BadRequest,
        };
    }
    return null;
}

export const validateMultipleIDs = (ids: number[]): Err|null => {
    for (const id of ids) {
        const idError = validateID(id);
        if (idError !== null) {
            return idError;
        }
    }
    return null;
}

export const checkOwnerIDs = (resourceId: number, requesterId: number): Err|null => {
    if (resourceId !== requesterId) {
        return {
            message: "You are not allowed to perform this action",
            status: HTTPCodes.Forbidden,
        };
    }
    return null;
}
