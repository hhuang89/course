export interface APIResponse<T = any> {
    data?: T;
    msg: string;
    code: number;
}