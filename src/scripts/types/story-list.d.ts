export interface StoryListItem {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
}

export type StoryList = StoryListItem[];
