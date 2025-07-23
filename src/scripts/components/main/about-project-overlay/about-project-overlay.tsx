import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import AboutProject from "../about-project/about-project";
import Overlay from "../overlay/overlay";

const AboutProjectOverlay: FunctionComponent = () => {
  const navigate = useNavigate();

  return <Overlay onClose={() => navigate(-1)}>{<AboutProject />}</Overlay>;
};

export default AboutProjectOverlay;
