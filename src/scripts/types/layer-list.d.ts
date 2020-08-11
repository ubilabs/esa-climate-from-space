interface LayerListItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  link: string;
  subLayers: LayerListItem[];
}

export type LayerList = LayerListItem[];
