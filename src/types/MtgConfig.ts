interface MtgConfig {
  db: string;
  input?: string;
  output: {
    collections?: string;
    sdls?: string;
    types: string;
  };
  uri: string;
}

export default MtgConfig;
