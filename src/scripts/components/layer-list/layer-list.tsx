import React, {FunctionComponent} from 'react';
import {Layer} from '../../actions/fetch-layers';

interface Props {
  layers: Layer[];
  selected: string;
  onSelect: (id: string) => void;
}

const LayerList: FunctionComponent<Props> = ({layers, selected, onSelect}) => {
  return (
    <ul>
      {layers.map(layer => (
        <li key={layer.id} onClick={() => onSelect(layer.id)}>
          {layer.name}
        </li>
      ))}
    </ul>
  );
};

export default LayerList;
