export interface IResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

export interface Paginator {
  page: number;
  limit: number;
  total?: number;
}
