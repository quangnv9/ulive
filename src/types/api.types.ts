export interface IApiResponse {
  totalItem: number;
  page: number;
  pageSize: number;
  totalPage: number;
}

export interface ApiParam {
  page?: number;
  pageSize?: number;
}
