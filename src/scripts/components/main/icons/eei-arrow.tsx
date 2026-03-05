import { FunctionComponent } from "react";

interface Props {
  variant: "down" | "up";
}

export const EEIArrow: FunctionComponent<Props> = ({ variant }) => {
  switch (variant) {
    case "down":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="326"
          height="326"
          viewBox="0 0 326 326"
          fill="none"
        >
          <path
            d="M0 56.5685L56.5685 9.53674e-07L325.269 268.701L319.612 319.612L268.701 325.269L0 56.5685Z"
            fill="url(#paint0_linear_3847_26510)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_3847_26510"
              x1="28.2843"
              y1="28.2843"
              x2="319.612"
              y2="319.612"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00B398" stopOpacity="0" />
              <stop offset="1" stopColor="#00B398" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "up":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="149"
          height="149"
          viewBox="0 0 149 149"
          fill="none"
        >
          <path
            d="M56.5685 148.492L9.53674e-07 91.9239L91.9239 1.01328e-05L142.836 5.65686L148.492 56.5686L56.5685 148.492Z"
            fill="url(#paint0_linear_3847_26506)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_3847_26506"
              x1="28.3544"
              y1="120.138"
              x2="142.836"
              y2="5.65685"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00B398" stopOpacity="0" />
              <stop offset="1" stopColor="#00B398" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};
