import { FunctionComponent } from "react";

interface Props {
  rounded?: boolean;
}

export const MouseIcon: FunctionComponent<Props> = ({ rounded }) => {
  if (rounded) {
    return <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      rotate="-90deg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 5.48276C6 3.55277 7.57354 2 9.5 2L14.5 2C16.4265 2 18 3.55277 18 5.48276L18 18.5172C18 20.4472 16.4265 22 14.5 22L9.5 22C7.57354 22 6 20.4472 6 18.5172L6 5.48276ZM9.5 4C8.66504 4 8 4.67037 8 5.48276L8 18.5172C8 19.3296 8.66504 20 9.5 20L14.5 20C15.335 20 16 19.3296 16 18.5172L16 5.48276C16 4.67037 15.335 4 14.5 4L9.5 4Z"
        fill="currentColor"
      />
      <path
        d="M11 7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7V9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9V7Z"
        fill="currentColor"
      />
    </svg>
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      rotate="-90deg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 5.48276C6 3.55277 7.57354 2 9.5 2L14.5 2C16.4265 2 18 3.55277 18 5.48276L18 18.5172C18 20.4472 16.4265 22 14.5 22L9.5 22C7.57354 22 6 20.4472 6 18.5172L6 5.48276ZM9.5 4C8.66504 4 8 4.67037 8 5.48276L8 18.5172C8 19.3296 8.66504 20 9.5 20L14.5 20C15.335 20 16 19.3296 16 18.5172L16 5.48276C16 4.67037 15.335 4 14.5 4L9.5 4Z"
        fill="currentColor"
      />
      <path
        d="M11 7C11 6.44772 11.4477 6 12 6C12.5523 6 13 6.44772 13 7V9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9V7Z"
        fill="currentColor"
      />
    </svg>
  );
};
