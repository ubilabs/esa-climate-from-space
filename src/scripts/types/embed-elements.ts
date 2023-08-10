export interface EmbedElementsState {
  logo?: boolean;
  stories_menu?: boolean;
  layers_menu?: boolean;
  share_button?: boolean;
  app_menu?: boolean;
  globe_navigation?: boolean;
}

export interface ElementOptions {
  [key: string]: boolean;
}
