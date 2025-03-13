import { FunctionComponent } from "react";
import { GetDataWidget } from "../data-widget/data-widget";
import { Marker } from "../../../types/marker-type";

interface Props {
  hideNavigation: boolean;
  markers: Marker[];
  backgroundColor: string
}

export const GlobeCompareLayer: FunctionComponent<Props> = ({
  hideNavigation,
  markers,
  backgroundColor
}) => {
  return (
    <GetDataWidget
      markers={markers}
      hideNavigation={Boolean(hideNavigation)}
      backgroundColor={backgroundColor}
    />
  );
};
