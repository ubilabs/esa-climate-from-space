interface LayerListItem {
  id: string;
  name: string;
  description: string;
  subLayers: LayerListItem[];
}

export type LayerList = LayerListItem[];
