export interface Story {
  id: string;
  slides: Slide[];
}

interface Slide {
  title: string;
  subtitle: string;
  bodytext: string;
  image: string;
}
