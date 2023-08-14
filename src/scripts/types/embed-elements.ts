export interface EmbedElementsState {
  logo?: boolean;
  stories_menu?: boolean;
  layers_menu?: boolean;
  share_button?: boolean;
  app_menu?: boolean;
  globe_navigation?: boolean;
  markers?: boolean;
  time_slider?: boolean;
  legend?: boolean;
  back_link?: boolean;
  header?: boolean;
  filter_tags?: boolean;
  story_header?: boolean;
  story_back_link?: boolean;
}

export interface ElementOptions {
  [key: string]: boolean | string;
}

export interface UiEmbedElement {
  title: string;
  elements: string[];
}
