import {
  SET_PROJECTION,
  Projection,
  SetProjectionAction
} from '../actions/set-projection';
import {State} from './index';

const initialState: Projection = Projection.Sphere;

function projectionReducer(
  state: Projection = initialState,
  action: SetProjectionAction
): Projection {
  switch (action.type) {
    case SET_PROJECTION:
      return action.projection;
    default:
      return state;
  }
}
export function projectionSelector(state: State): Projection {
  return state.projection;
}
export default projectionReducer;
