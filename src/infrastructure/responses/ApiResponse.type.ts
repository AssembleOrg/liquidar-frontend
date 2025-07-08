export type ApiResponse<T> = {
  status: 'success' | 'error';
  data: T;
  message: string;
  path: string;
  timestamp: string;
  statusCode: number;
};