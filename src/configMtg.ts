import genTypes from './genTypes';
import MtgConfig from './types/MtgConfig';

const configMtg = ({ db, input, output, uri }: MtgConfig) => {
  Object.entries({
    db,
    input,
    output,
    uri,
  }).forEach(([key, value]) => {
    if (!value) throw Error(`${key} required but received ${value}`);
  });
  const { types } = output;
  Object.entries({
    types,
  }).forEach(([key, value]) => {
    if (!value) throw Error(`${key} required but received ${value}`);
  });

  return genTypes({
    db,
    input,
    output,
    uri,
  });
};

export default configMtg;
