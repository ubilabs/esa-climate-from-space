import {useContext} from 'react';

import {GlobeContext} from '../provider/globe-provider';

export const useGlobeMarkers = () => useContext(GlobeContext)?.markers;

export const useGlobeLayers = () => useContext(GlobeContext)?.layers;

export const useGlobe = () => useContext(GlobeContext)?.globe;
