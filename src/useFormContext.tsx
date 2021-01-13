import { useContext } from 'react';
import { FormContext } from './Form';

export const useFormContext = () => {
  return useContext(FormContext);
};
