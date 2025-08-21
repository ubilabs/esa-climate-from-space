import { FunctionComponent, ReactNode } from "react";

import ImageWavelength from "./modules/image-wavelength/image-wavelength";
import ImageCompare from "./modules/image-compare/image-compare";
import ImageTime from "./modules/image-time/image-time";
import ImageScroll from "./modules/image-scroll/image-scroll";
import TextOverlay from "../generic/text-overlay/text-overlay";

import styles from "./image-gallery.module.css";

export type ImageGalleryCompoundComponents = {
  ImageWavelength: typeof ImageWavelength;
  ImageCompare: typeof ImageCompare;
  ImageTime: typeof ImageTime;
  ImageScroll: typeof ImageScroll;
  TextOverlay: typeof TextOverlay;
};

export const ImageGallery = (({ children }: { children: ReactNode }) => {
  return <article className={styles.imageGallery}>{children}</article>;
}) as FunctionComponent<{ children: ReactNode }> &
  ImageGalleryCompoundComponents;

ImageGallery.ImageWavelength = ImageWavelength;
ImageGallery.ImageCompare = ImageCompare;
ImageGallery.ImageTime = ImageTime;
ImageGallery.ImageScroll = ImageScroll;
ImageGallery.TextOverlay = TextOverlay;
