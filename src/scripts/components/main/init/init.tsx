import { FunctionComponent, useEffect } from "react";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import fetchStories from "../../../actions/fetch-stories";
import { useGetLayersQuery, useGetStoriesQuery } from "../../../services/api";

const Init: FunctionComponent = () => {
  const dispatch = useThunkDispatch();

  console.log("fetching stories");
  //   useEffect(() => {
  //     dispatch(fetchStories());
  // }, [dispatch]);

  const { data: stories } = useGetStoriesQuery("en");
  console.log("🚀 ~ stories:", stories);

  return null;
};

export default Init;
