import {EmbedElementsState} from '../types/embed-elements';

export const getDisabledParams = (embedElements: EmbedElementsState) =>
  Object.entries(embedElements)
    .filter(
      ([key, value]) =>
        value === false || (key === 'lng' && value !== 'autoLng')
    )
    .map(key => `${key[0]}=${key[1]}`)
    .join('&');
