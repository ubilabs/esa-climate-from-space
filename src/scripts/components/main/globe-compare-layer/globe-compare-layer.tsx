import { FunctionComponent } from "react";
import { GetDataWidget } from "../data-widget/data-widget";
import { Marker } from "../../../types/marker-type";

interface Props {
  markers: Marker[];
  backgroundColor: string;
}

export const GlobeCompareLayer: FunctionComponent<Props> = ({
  markers,
  backgroundColor,
}) => {
  return <GetDataWidget markers={markers} backgroundColor={backgroundColor} />;
};
