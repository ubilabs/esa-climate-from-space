import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { useInterval } from "../../../hooks/use-interval";

interface Props {
  autoPlayLink: string;
  delay: number;
}

const Autoplay: FunctionComponent<Props> = ({ autoPlayLink, delay }) => {
  const navigate = useNavigate();

  useInterval(() => {
    void (autoPlayLink && navigate(autoPlayLink, { replace: true }));
  }, delay);

  return null;
};

export default Autoplay;
