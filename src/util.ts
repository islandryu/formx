export const isFunction = (obj: any): obj is Function =>
  typeof obj === 'function';

export const isPromise = (value: any): value is PromiseLike<any> =>
  isObject(value) && isFunction(value.then);

export const isObject = (obj: any): obj is Object =>
  obj !== null && typeof obj === 'object';
