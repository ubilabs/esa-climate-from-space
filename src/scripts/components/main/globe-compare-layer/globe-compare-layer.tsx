import { FunctionComponent } from "react";
import { GetDataWidget } from "../data-widget/data-widget";

interface Props {
  className?: string;
}

export const GlobeCompareLayer: FunctionComponent<Props> = ({ className }) => {
  return <GetDataWidget className={className} showMarkers={false} />;
};
