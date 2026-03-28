import EventEmitter from "events";

export const pendingRequestMap = new Map<string, EventEmitter>();
