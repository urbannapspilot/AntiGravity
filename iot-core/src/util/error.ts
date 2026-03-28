import { ErrorOperationStatus } from "../communication/http-types";

export class IoTError extends Error {
  public reason: string;
  public statusCode: number;

  public constructor(reason: string, message?: string, statusCode: number = 500) {
    super(message);
    this.reason = reason;
    this.statusCode = statusCode;
  }

  public static handleCatch(error: any): IoTError {
    if (error instanceof IoTError) {
      return error;
    }
    return new IoTError('RUNTIME_ERROR', error.message);
  }

  public static getHttpErrorResponse(err: any): ErrorOperationStatus {
    return {
      success: false,
      errorCode: err?.statusCode || 500,
      reason: err.reason || 'UNKNOWN_ERROR',
      errorMessage: err.message || 'An unexpected error occurred'
    };
  }
}
