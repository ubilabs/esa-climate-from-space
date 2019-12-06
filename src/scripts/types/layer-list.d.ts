interface LayerListItem {
  id: string;
  name: string;
  description: string;
  link: string;
  subLayers: LayerListItem[];
}

export type LayerList = LayerListItem[];
