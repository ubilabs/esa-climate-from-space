import { PayloadAction } from "@reduxjs/toolkit";

export interface RTKQueryAction extends PayloadAction {
  meta?: {
    arg: {
      endpointName: unknown;
      originalArgs: {
        id?: string;
        ids?: string[];
        language?: string;
      };
    };
    requestStatus: string;
  };
}
export interface ActionToPersist {
  meta: {
    arg: {
      endpointName: string;
    };
  };
  save: boolean;
  load: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  getFilePath?: (errorAction: RTKQueryAction) => string;
}
