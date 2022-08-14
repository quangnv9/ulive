import { useLocation } from 'react-router';

export const useParseParams = (): any => {
  const location = useLocation();
  if (!location.search) {
    return {};
  }
  const search = location.search.replace('?', '').split('&');
  const objParams = {} as any;
  search.forEach((item) => {
    const arrParam = item.split('=');
    objParams[arrParam[0]] = arrParam[1];
  });
  return objParams;
};
