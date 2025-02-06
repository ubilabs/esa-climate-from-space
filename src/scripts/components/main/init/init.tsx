import { FunctionComponent, useEffect } from "react";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import fetchStories from "../../../actions/fetch-stories";

const Init: FunctionComponent = () => {
  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  return null;
};

export default Init;
