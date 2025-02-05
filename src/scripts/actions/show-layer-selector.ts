export const SHOW_LAYER_SELECTOR = "SHOW_LAYER_SELECTOR";

export interface ShowLayerSelectorAction {
  type: typeof SHOW_LAYER_SELECTOR;
  showLayerSelector: boolean;
}

const showLayerSelectorAction = (
  showLayerSelector: boolean,
): ShowLayerSelectorAction => ({
  type: SHOW_LAYER_SELECTOR,
  showLayerSelector,
});

export default showLayerSelectorAction;
