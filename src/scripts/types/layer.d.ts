export interface Layer {
  id: string;
  name: string;
  description: string;
  metadataUrl: string;
  subLayers: Layer[];
}
