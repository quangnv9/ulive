import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useOpenMenu = () => {
  const [defaultOpenKey, setDefaultOpenKey] = React.useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    let arrOpenKey = [];
    const keyDefaultOpen = pathname.replace('/', '').split('/')[0];
    arrOpenKey.push(keyDefaultOpen);
    setDefaultOpenKey(arrOpenKey);
  }, [location]);
  return defaultOpenKey;
};
