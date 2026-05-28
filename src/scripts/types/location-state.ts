import { ActiveSearchState } from "./search";

export interface AppLocationState {
  search?: ActiveSearchState;
  backLink?: string;
}
