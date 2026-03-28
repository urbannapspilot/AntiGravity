export interface OperationStatus {
  success: boolean;
};

export interface SucessOperationStatus extends OperationStatus {
  success: true;
}

export interface ErrorOperationStatus extends OperationStatus {
  success: false;
  errorCode: number;
  errorMessage: string;
  reason: string;
}


