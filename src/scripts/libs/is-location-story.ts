import { Story } from "../types/story";

// A story can be "location based" where the splashscreen does not have an image
// We consider a location based story if the splashscreen has a location defined
export function isLocationStory(story: Story | null) {
  const location = story?.splashscreen?.location;
  return location && [2, 3].includes(Object.keys(location).length);
}
