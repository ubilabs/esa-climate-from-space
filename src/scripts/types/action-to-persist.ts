export interface ActionToPersist {
  success: string;
  error: string;
  save: boolean;
  load: boolean;
  path?: string;
}
