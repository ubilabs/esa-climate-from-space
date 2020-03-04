import {FunctionComponent} from 'react';

export interface MenuItem {
  id: string;
  link?: string;
  icon: FunctionComponent;
}
