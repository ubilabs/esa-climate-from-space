export interface EmbedElementsState {
  logo?: boolean;
  time_slider?: boolean;
  legend?: boolean;
  header?: boolean;
  back_link?: boolean;
  app_menu?: boolean;
  layers_menu?: boolean;
  lng: string | null;
}

export interface ElementOptions {
  [key: string]: boolean | string;
}

export interface UiEmbedElement {
  embedPath: string;
  title: string;
  elements: string[];
}
