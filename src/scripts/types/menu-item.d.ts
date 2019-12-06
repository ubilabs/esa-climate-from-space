import {FunctionComponent} from 'react';

export interface MenuItem {
  id: string;
  name: string;
  link?: string;
  icon: FunctionComponent;
}
