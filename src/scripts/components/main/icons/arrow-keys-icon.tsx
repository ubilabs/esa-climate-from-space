import { FunctionComponent } from "react";

interface Props {
  isWhite?: boolean;
}

export const ArrowKeysIcon: FunctionComponent<Props> = ({ isWhite }) => {
  const primaryColor = isWhite ? "#FFF" : "#30404D";
  const secondaryColor = isWhite ? "#FFF" : "#3F6C7D";

  return (
    <svg
      width="62"
      height="40"
      viewBox="0 0 62 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 34L7 31L10 28V34Z" fill={primaryColor} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 22C16.55 22 17.0204 22.1962 17.4121 22.5879C17.8038 22.9796 18 23.45 18 24V38C18 38.55 17.8038 39.0204 17.4121 39.4121C17.0204 39.8038 16.55 40 16 40H2C1.45 40 0.979557 39.8038 0.587891 39.4121C0.196224 39.0204 0 38.55 0 38V24C0 23.45 0.196224 22.9796 0.587891 22.5879C0.979557 22.1962 1.45 22 2 22H16ZM2 38H16V24H2V38Z"
        fill={primaryColor}
      />
      <path d="M31 33L28 30H34L31 33Z" fill={secondaryColor} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38 22C38.55 22 39.0204 22.1962 39.4121 22.5879C39.8038 22.9796 40 23.45 40 24V38C40 38.55 39.8038 39.0204 39.4121 39.4121C39.0204 39.8038 38.55 40 38 40H24C23.45 40 22.9796 39.8038 22.5879 39.4121C22.1962 39.0204 22 38.55 22 38V24C22 23.45 22.1962 22.9796 22.5879 22.5879C22.9796 22.1962 23.45 22 24 22H38ZM24 38H38V24H24V38Z"
        fill={secondaryColor}
      />
      <path d="M55 31L52 34V28L55 31Z" fill={primaryColor} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M60 22C60.55 22 61.0204 22.1962 61.4121 22.5879C61.8038 22.9796 62 23.45 62 24V38C62 38.55 61.8038 39.0204 61.4121 39.4121C61.0204 39.8038 60.55 40 60 40H46C45.45 40 44.9796 39.8038 44.5879 39.4121C44.1962 39.0204 44 38.55 44 38V24C44 23.45 44.1962 22.9796 44.5879 22.5879C44.9796 22.1962 45.45 22 46 22H60ZM46 38H60V24H46V38Z"
        fill={primaryColor}
      />
      <path d="M34 10H28L31 7L34 10Z" fill={secondaryColor} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38 0C38.55 0 39.0204 0.196224 39.4121 0.587891C39.8038 0.979557 40 1.45 40 2V16C40 16.55 39.8038 17.0204 39.4121 17.4121C39.0204 17.8038 38.55 18 38 18H24C23.45 18 22.9796 17.8038 22.5879 17.4121C22.1962 17.0204 22 16.55 22 16V2C22 1.45 22.1962 0.979557 22.5879 0.587891C22.9796 0.196224 23.45 0 24 0H38ZM24 16H38V2H24V16Z"
        fill={secondaryColor}
      />
    </svg>
  );
};
