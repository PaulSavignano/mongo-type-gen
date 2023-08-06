import downloadValidators from './downloadValidators';

downloadValidators().then((returnCode) => {
  process.exit(returnCode);
});
