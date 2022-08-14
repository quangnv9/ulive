process.env.REACT_APP_STAGE = process.env.REACT_APP_STAGE || process.argv[2] || 'staging';
exports = module.exports = require('./app');
