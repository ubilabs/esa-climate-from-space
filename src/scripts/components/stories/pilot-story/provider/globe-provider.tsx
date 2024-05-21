import React, {createContext, FunctionComponent, useRef, useState} from 'react';

import {LayerProps, MarkerProps} from '@ubilabs/esa-webgl-globe';

interface GlobeContextValue {
  markers: {
    markers: MarkerProps[];
    setMarkers: (markers: MarkerProps[]) => void;
  };
  layers: {
    layers: LayerProps[];
    setLayers: (layers: LayerProps[]) => void;
  };
  globe: {
    isSpinning: React.MutableRefObject<boolean>;
    setIsSpinning: (isSpinning: boolean) => void;
    isTouchable: React.MutableRefObject<boolean>;
    setIsTouchable: (isTouchable: boolean) => void;
  };
}

export const GlobeContext = createContext<GlobeContextValue>({
  markers: {markers: [], setMarkers: () => {}},
  layers: {layers: [], setLayers: () => {}},
  globe: {
    isSpinning: {current: true},
    setIsSpinning: () => {},
    isTouchable: {current: false},
    setIsTouchable: () => {}
  }
});

interface Props {
  children: React.ReactNode;
}

export const GlobeContextProvider: FunctionComponent<Props> = ({children}) => {
  const isSpinning = useRef<boolean>(true);
  const isTouchable = useRef<boolean>(false);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);

  // Latest timestamp: December 2021
  const timeIndex = 71;
  // @ts-ignore - injected via webpack's define plugin
  const version = INFO_VERSION;

  const [layers, setLayers] = React.useState<LayerProps[]>([
    {
      id: 'basemap',
      zIndex: 0,
      type: 'tile',
      maxZoom: 5,
      urlParameters: {},
      getUrl: ({x, y, zoom}) =>
        `https://storage.googleapis.com/esa-cfs-tiles/${version}/basemaps/land/${zoom}/${x}/${y}.png`
    } as LayerProps,
    {
      id: 'greenhouse.xch4',
      zIndex: 1,
      type: 'tile',
      maxZoom: 5,
      urlParameters: {},
      getUrl: ({x, y, zoom}) =>
        `https://storage.googleapis.com/esa-cfs-tiles/${version}/greenhouse.xch4/tiles/${timeIndex}/${zoom}/${x}/${y}.png`
    } as LayerProps
  ]);

  return (
    <GlobeContext.Provider
      value={{
        markers: {markers, setMarkers},
        layers: {layers, setLayers},
        globe: {
          isSpinning,
          setIsSpinning: spinning => {
            isSpinning.current = spinning;
          },
          isTouchable,
          setIsTouchable: touchable => {
            isTouchable.current = touchable;
          }
        }
      }}>
      {children}
    </GlobeContext.Provider>
  );
};
