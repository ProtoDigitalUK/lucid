export interface APIResponse<Data> {
  data: Data;
  meta: {
    path: string;
    links: Array<{}>;
    current_page: number | null;
    per_page: number | null;
    total: number | null;
    last_page: number | null;
  };
}

export interface APIErrorResponse {
  status: number;
  name: string;
  message: string;
  errors: ErrorResult;
}

export interface ErrorResult {
  // @ts-ignore
  code?: string;
  // @ts-ignore
  message?: string;
  // @ts-ignore
  children?: Array<undefined | ErrorResult>;
  [key: string]: ErrorResult;
}
