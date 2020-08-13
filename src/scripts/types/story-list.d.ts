export interface StoryListItem {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
  position: number[];
}

export type StoryList = StoryListItem[];
