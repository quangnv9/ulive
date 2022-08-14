const CracoLessPlugin = require('craco-less');

module.exports = {
  style: {
    postcss: {
      plugins: [require('autoprefixer')],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#D8528E',
              '@font-size-base': '16px',
              '@font-family': '"Poppins", sans-serif',
              '@btn-disable-bg': '#cbbfc4',
              '@btn-height-base': '48px',
              '@btn-height-lg': '56px',
              '@btn-height-sm': '38px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
