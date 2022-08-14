import localConfig from '../env/local.json';
import devConfig from '../env/dev.json';
import testConfig from '../env/test.json';
import stagingConfig from '../env/staging.json';
const REACT_APP_STAGE = process.env.REACT_APP_STAGE;

export const configEnv = (function () {
  switch (REACT_APP_STAGE) {
    case 'local':
      return localConfig;

    case 'dev':
      return devConfig;

    case 'test':
      return testConfig;

    case 'staging':
      return stagingConfig;

    default:
      return devConfig;
  }
})();
