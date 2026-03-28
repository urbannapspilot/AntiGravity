"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoTError = void 0;
class IoTError extends Error {
    reason;
    statusCode;
    constructor(reason, message, statusCode = 500) {
        super(message);
        this.reason = reason;
        this.statusCode = statusCode;
    }
    static handleCatch(error) {
        if (error instanceof IoTError) {
            return error;
        }
        return new IoTError('RUNTIME_ERROR', error.message);
    }
    static getHttpErrorResponse(err) {
        return {
            success: false,
            errorCode: err?.statusCode || 500,
            reason: err.reason || 'UNKNOWN_ERROR',
            errorMessage: err.message || 'An unexpected error occurred'
        };
    }
}
exports.IoTError = IoTError;
