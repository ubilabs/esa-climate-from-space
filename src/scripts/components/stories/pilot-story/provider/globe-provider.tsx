import React, {createContext, FunctionComponent, useRef, useState} from 'react';

import {LayerProps, MarkerProps} from '@ubilabs/esa-webgl-globe';

import {GREY_BASE_MAP, GREENHOUSE_XCH4} from '../config/main';

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
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
  };
}

export const GlobeContext = createContext<GlobeContextValue>({
  markers: {markers: [], setMarkers: () => {}},
  layers: {layers: [], setLayers: () => {}},
  globe: {
    isSpinning: {current: true},
    setIsSpinning: () => {},
    isTouchable: {current: false},
    setIsTouchable: () => {},
    isVisible: false,
    setIsVisible: () => {}
  }
});

interface Props {
  children: React.ReactNode;
}

export const GlobeContextProvider: FunctionComponent<Props> = ({children}) => {
  const isSpinning = useRef<boolean>(true);
  const isTouchable = useRef<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);

  const [layers, setLayers] = React.useState<LayerProps[]>([
    GREY_BASE_MAP,
    GREENHOUSE_XCH4
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
          },
          isVisible,
          setIsVisible
        }
      }}>
      {children}
    </GlobeContext.Provider>
  );
};
