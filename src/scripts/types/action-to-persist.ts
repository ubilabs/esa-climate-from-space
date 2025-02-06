import { AnyAction } from "redux";

export interface ActionToPersist {
  success: string;
  error: string;
  save: boolean;
  load: boolean;
  getFilePath?: (errorAction: AnyAction) => string;
  successActionCreator?: (
    errorAction: AnyAction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any,
  ) => AnyAction;
}
