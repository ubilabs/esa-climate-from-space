import { FunctionComponent, use, useEffect } from "react";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import fetchStories from "../../../actions/fetch-stories";
import {
  storiesApi,
  useGetLayersQuery,
  useGetStoriesQuery,
} from "../../../services/api";

const Init: FunctionComponent = () => {
  const dispatch = useThunkDispatch();

  useEffect(() => {
    const result = dispatch(storiesApi.endpoints.getStories.initiate("en"));

    return result.unsubscribe;
  });

  return null;
};

export default Init;
