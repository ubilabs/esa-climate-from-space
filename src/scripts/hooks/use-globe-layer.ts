import {useEffect} from 'react';
import {
  GeographicTilingScheme,
  UrlTemplateImageryProvider,
  TextureMinificationFilter,
  TextureMagnificationFilter,
  SingleTileImageryProvider,
  Viewer,
  ImageryLayer,
  ImageryLayerCollection
} from 'cesium';

import {GlobeImageLayerData} from '../types/globe-image-layer-data';
import {LayerType} from '../types/globe-layer-type';

// update layer image when url changes
export function useGlobeLayer(
  viewer: Viewer | null,
  imageLayer: GlobeImageLayerData | null
) {
  useEffect(() => {
    if (!viewer) {
      return;
    }

    const layers = viewer.scene.imageryLayers;

    if (imageLayer) {
      const imageryProvider = getImageProvider(imageLayer);

      imageryProvider.readyPromise.then(() => {
        const newLayer = viewer.scene.imageryLayers.addImageryProvider(
          imageryProvider
        );

        const filterLinear = imageLayer.filter === 'linear';

        // @ts-ignore
        newLayer.minificationFilter = filterLinear
          ? TextureMinificationFilter.LINEAR
          : TextureMinificationFilter.NEAREST;
        // @ts-ignore
        newLayer.magnificationFilter = filterLinear
          ? TextureMagnificationFilter.LINEAR
          : TextureMagnificationFilter.NEAREST;
        newLayer.alpha = 1;

        // remove and destroy old layers if they exist
        // we do not clean it up in the useEffect clean function because we want
        // to wait until the new layer is ready to prevent flickering
        const layersToRemove: ImageryLayer[] = [];

        for (let i = 0; i < layers.length; i++) {
          const layer = layers.get(i);
          if (i !== 0 && layer !== newLayer) {
            layersToRemove.push(layer);
          }
        }

        const cleanAndCache = () => {
          // eslint-disable-next-line max-nested-callbacks
          layersToRemove.forEach(layer => layers.remove(layer, true));

          // preload next images
          if (imageLayer.type === LayerType.Image) {
            preloadNext(imageLayer.nextUrls);
          }
        };

        if (imageLayer.type === LayerType.Tiles) {
          setTimeout(cleanAndCache, 500);
        } else {
          requestAnimationFrame(cleanAndCache);
        }
      });
    } else if (layers.length > 1) {
      // remove old layers when no image should be shown anymore (except base map)
      removeAllLayers(layers);
    }
  }, [viewer, imageLayer]);
}

function getImageProvider(imageLayer: GlobeImageLayerData) {
  return imageLayer.type === LayerType.Tiles
    ? new UrlTemplateImageryProvider({
        url: imageLayer.url,
        tilingScheme: new GeographicTilingScheme(),
        minimumLevel: 0,
        maximumLevel: imageLayer.zoomLevels - 1,
        tileWidth: 256,
        tileHeight: 256
      })
    : new SingleTileImageryProvider({url: imageLayer.url});
}

function removeAllLayers(layers: ImageryLayerCollection) {
  for (let i = 1; i < layers.length; i++) {
    const layer = layers.get(i);
    layers.remove(layer, true);
  }
}

function preloadNext(urls: string[]) {
  urls.forEach(url => {
    const image = new Image();
    image.src = url;
  });
}
