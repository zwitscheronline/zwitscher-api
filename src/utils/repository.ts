import { RequestOptions } from "../types/request_options";

export interface Repository<T> {
    create(data: T): Promise<T>;
    update(data: T): Promise<T>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<T|null>;
    findAll(options: RequestOptions): Promise<T[]>;
}
