import { State } from "../reducers/index";


export function contentSelector(state: State){
  return state.content;
}
