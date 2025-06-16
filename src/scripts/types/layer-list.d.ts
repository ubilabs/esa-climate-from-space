interface LayerListItem {
  id: string;
  type: string;
  name: string;
  shortName: string;
  description: string;
  link: string;
  usageInfo: string;
  subLayers: LayerListItem[];
  categories: string[];
  position?: [number, number];
}

export type LayerList = LayerListItem[];
