export class ResponseData<D = any> {
  statusCode: number;
  message: string;
  error: string | null;
  data: D | D[] | null;

  constructor(
    statusCode: number,
    message: string,
    error: string | null = null,
    data: D | D[] | null = null,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.data = data;
  }

  static success<T>(
    data: T | T[],
    message: string = 'Success',
  ): ResponseData<T> {
    return new ResponseData(HttpStatus.SUCCESS, message, null, data);
  }

  static error(
    message: string,
    statusCode: number = HttpStatus.ERROR,
  ): ResponseData {
    return new ResponseData(statusCode, HttpMessage.ERROR, message, null);
  }
}

export enum HttpStatus {
  ERROR = 404,
  SUCCESS = 200,
}

export enum HttpMessage {
  ERROR = 'Error',
  SUCCESS = 'Success',
}

export enum HttpError {
  ERROR = 'An error occurred',
}
