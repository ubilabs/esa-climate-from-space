import {FunctionComponent} from 'react';

export interface MenuItem {
  id: string;
  icon: FunctionComponent;
  subItems?: SubItem[];
}

interface SubItem {
  id: string;
  link?: string;
}
