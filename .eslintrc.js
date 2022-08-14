module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'no-console': 'warn',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'jsx-a11y/anchor-is-valid': ['off'],
    'comma-dangle': ['error', 'always-multiline'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
