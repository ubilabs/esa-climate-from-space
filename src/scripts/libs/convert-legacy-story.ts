import {
  EmbeddedItem,
  GalleryItemType,
  GlobeItem,
  ImageItem,
  VideoItem
} from '../types/gallery-item';
import {LegacySlide, LegacyStory} from '../types/legacy-story';
import {SlideType} from '../types/slide-type';
import {Story} from '../types/story';

const getGalleryItems = (slide: LegacySlide) => {
  if (slide.type === SlideType.Video) {
    return [
      {
        type: GalleryItemType.Video,
        videoId: slide.videoId,
        videoSrc: slide.videoSrc,
        videoCaptions: slide.videoCaptions,
        videoPoster: slide.videoPoster
      }
    ] as VideoItem[];
  }

  if (slide.type === SlideType.Image && slide.images) {
    return slide.images.map((image, index) => ({
      type: GalleryItemType.Image,
      imageCaption: slide.imageCaptions
        ? slide.imageCaptions[index]
        : // eslint-disable-next-line no-undefined
          undefined,
      image,
      // eslint-disable-next-line no-undefined
      imageFit: slide.imageFits ? slide.imageFits[index] : undefined
    })) as ImageItem[];
  }

  if (slide.type === SlideType.Globe) {
    return [
      {
        type: GalleryItemType.Globe,
        flyTo: slide.flyTo,
        markers: slide.markers,
        layer: slide.layer,
        layerDescription: slide.layerDescription
      }
    ] as GlobeItem[];
  }

  if (slide.type === SlideType.Embedded) {
    return [
      {
        type: GalleryItemType.Embedded,
        embeddedSrc: slide.embeddedSrc
      }
    ] as EmbeddedItem[];
  }

  return [];
};

/**
 * Used to convert legacy story object coming from the API to the new internal story object
 *
 * @param story Legacy story object
 * @returns Story object
 */
export const convertLegacyStory = (story: LegacyStory): Story => ({
  id: story.id,
  slides: story.slides.map(slide => ({
    text: slide.text,
    shortText: slide.shortText,
    galleryItems: getGalleryItems(slide),
    splashImage:
      slide.images && slide.type === 'splashscreen'
        ? slide.images[0]
        : // eslint-disable-next-line no-undefined
          undefined
  }))
});
