import { useQuery } from 'react-query';
import { getAllCity } from 'services/api-city.service';

export const useAllCityQuery = () => {
  return useQuery(['allCity'], () => {
    return getAllCity();
  });
};
