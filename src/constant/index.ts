import localConfig from '../env/local.json';
import devConfig from '../env/dev.json';
import testConfig from '../env/test.json';
import stagingConfig from '../env/staging.json';

const REACT_APP_STAGE = process.env.REACT_APP_STAGE;

export const configs = (function () {
  switch (REACT_APP_STAGE) {
    case 'dev':
      return localConfig;

    case 'test':
      return testConfig;

    case 'production':
      return testConfig;

    case 'staging':
      return stagingConfig;

    default:
      return devConfig;
  }
})();

export const initFilter = {
  page: 1,
  pageSize: 12,
};
export const listSizePage = ['12', '24'];
