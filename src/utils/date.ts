import { differenceInMinutes } from 'date-fns';
import moment from 'moment';

export const checkDateIsValid = (dateStart: Date, dateEnd = new Date(), distance: number) => {
  return differenceInMinutes(dateStart, dateEnd) > distance;
};

export const formatDate = (inputDate: string, format = 'DD/MM/YYYY') => {
  return moment(inputDate).format(format);
};
