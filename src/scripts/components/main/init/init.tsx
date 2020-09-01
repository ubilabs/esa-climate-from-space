import {FunctionComponent, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import fetchStories from '../../../actions/fetch-stories';

const Init: FunctionComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  return null;
};

export default Init;
