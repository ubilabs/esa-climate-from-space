import {EmbedElementsState} from '../types/embed-elements';

export const getEmbedParamsString = (uiElementsChecked: EmbedElementsState) => {
  const disabledParams = Object.fromEntries(
    Object.entries(uiElementsChecked)
      .filter(
        ([key, value]) =>
          value === false || (key === 'lng' && value !== 'autoLng')
      )
      .map(([key, value]) => [key, value.toString()])
  );

  return new URLSearchParams(disabledParams).toString();
};
