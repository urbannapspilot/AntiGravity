import { IoTError } from "../util/error";
import { RfidCard } from "@urbannaps/urbannaps-orm";

// Define request types as a union of string literals
export type RequestType = "GET_FEATURES" | "GET_RFID_LIST" | "GET_REMOTE" | "POST_RFID_SCANNED" | "POST_ONLINE_BOOKING" | "PUT_ONLINE_REMOTE_ACTION"
  | "POST_RESET_BOOKING" | "POST_VACANT_SEAT" | "GET_POD_STATUS";

// Generic type for response data, wrapping it with potential error handling
export type ResponseData<T> = T | IoTError;

// Using Pick utility type to create a partial type from RfidCard
export type PartialRfid = Pick<RfidCard, 'card_number' | 'card_type' | 'usage_time'>;

// Defining a common interface for all Remote controlled features
export interface Remote {
  fan: number;
  music: number;
  massage: number;
  light: number;
  oxygen: number;
  heat: number;
  door: number;
  seat: number;
}

// Generic base format for all types of responses and requests
export interface BaseFormat<T> {
  requestId: string;
  requestType: RequestType;
  data: ResponseData<T>;
}
// For requests with no data
export type NullDataRequest = BaseFormat<null>;

// Feature-specific response data interfaces
export interface GetFeaturesResponseData {
  features: Remote;
  expiresAt: number;
}

// Simplifying response type definitions using generics
export type GetFeaturesResponse = BaseFormat<GetFeaturesResponseData>;

export interface GetRfidResponseData {
  rfid: PartialRfid[];
  expiresAt: number;
}
export type GetRfidResponse = BaseFormat<GetRfidResponseData>;

export interface GetRemoteData {
  remote: Remote;
  generatedAt: number;
}
export type GetRemoteResponse = BaseFormat<GetRemoteData>;


export type GetRemoteRequest = BaseFormat<null>;

// RFID scanning-specific request data interface
export interface PostRfidScannedRequestData {
  rfidNumber: string;
}
export type PostRfidScannedRequest = BaseFormat<PostRfidScannedRequestData>;

// Online booking-specific request and response data interfaces
export interface PostOnlineBookingRequestData {
  bookingId: string;
  startTime: number;
  endTime: number;
}
export type PostOnlineBookingRequest = BaseFormat<PostOnlineBookingRequestData>;
export type PostOnlineBookingResponse = NullDataRequest;

// Remote action modification request and response interfaces
export interface PutOnlineRemoteActionRequestData {
  remote: Partial<Remote>;
  generatedAt: number;
}
export type PutOnlineRemoteActionResponseData = GetRemoteData;
export type PutOnlineRemoteActionRequest = BaseFormat<PutOnlineRemoteActionRequestData>;
export type PutOnlineRemoteActionResponse = BaseFormat<PutOnlineRemoteActionResponseData>;

export interface PostResetBookingRequestData {
  bookingId: string;
  generatedAt: number;
}

export type PostResetBookingRequest = BaseFormat<PostResetBookingRequestData>;
export type PostResetBookingResponse = NullDataRequest;

export type GetPodStatusRequest = BaseFormat<null>;
export interface GetPodStatusResponseData {
  booking: boolean
}
export type GetPodStatusResponse = BaseFormat<GetPodStatusResponseData>;

