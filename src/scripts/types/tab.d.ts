import { FunctionComponent } from "react";

export interface Tab {
  id: string;
  label: string;
  disabled: boolean;
  icon?: FunctionComponent;
}
