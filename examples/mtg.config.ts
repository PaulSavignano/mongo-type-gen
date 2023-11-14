import configMtg from '../src';

export default configMtg({
  db: 'mongo-type-gen',
  input: '**/*.collection.*s',
  output: {
    collections: 'examples/collections',
    sdls: 'examples/sdls',
    types: 'examples/types',
  },
  uri: 'mongodb://localhost:27017',
});
