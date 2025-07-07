import { FunctionComponent, PropsWithChildren } from "react";
import { Parallax, ParallaxProps } from "react-scroll-parallax";

export const ParallaxObject: FunctionComponent<
  PropsWithChildren<ParallaxProps>
> = ({ children, ...props }) => {
  return <Parallax {...props}>{children}</Parallax>;
};
