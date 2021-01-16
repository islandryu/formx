import { useEffect, useState } from 'react';
import { useFormContext } from '.';
import { FormProp } from './types';

export const useSubscribe = () => {
  const [state, setState] = useState<FormProp>({ values: {}, errors: {} });
  const { subscribe } = useFormContext();
  useEffect(() => {
    subscribe((formProp) => setState(formProp));
  }, []);
  return state;
};
