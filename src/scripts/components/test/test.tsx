import React, {FunctionComponent} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {layersSelector} from '../../reducers/layers';
import addLayersActionCreator from '../../actions/layers';

const Test: FunctionComponent<{}> = () => {
  const layers = useSelector(layersSelector);
  const dispatch = useDispatch();

  const onClickHandler = () => {
    const action = addLayersActionCreator([1, 2, 6, 7]);
    dispatch(action);
  };

  return (
    <div>
      {layers.join('-')}
      <button onClick={onClickHandler}></button>
    </div>
  );
};

export default Test;
