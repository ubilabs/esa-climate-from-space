import {AnyAction} from 'redux';

export interface ActionToPersist {
  success: string;
  error: string;
  save: boolean;
  load: boolean;
  getFilePath?: (errorAction: AnyAction) => string;
  successActionCreator?: (
    errorAction: AnyAction,
    content: unknown
  ) => AnyAction;
}
