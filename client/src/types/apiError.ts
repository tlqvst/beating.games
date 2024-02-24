import { AxiosResponse } from 'axios';

export interface ApiError extends AxiosResponse {
  response: {
    data: {
      error?: string;
      message?: string;
      statusCode?: number;
    };
  };
}
