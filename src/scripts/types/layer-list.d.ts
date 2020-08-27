interface LayerListItem {
  id: string;
  type: string;
  name: string;
  shortName: string;
  description: string;
  link: string;
  subLayers: LayerListItem[];
}

export type LayerList = LayerListItem[];
