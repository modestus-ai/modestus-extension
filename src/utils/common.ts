import { v4 as uuidv4 } from 'uuid';

export const getChunks = (arr: Array<any>, chunkSize: number) => {
  if (chunkSize <= 0) throw 'Invalid chunk size';
  const R = [];
  const len = arr.length;
  for (let i = 0; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize));
  return R;
};

export const sleep = (ms: number) => {
  return new Promise<void>((res, rej) => setTimeout(() => res(), ms));
};

export const currentTimestamp = () => {
  return Math.round(new Date().getTime() / 1000);
};

export const isNumberInRange = (n: number, nStart: number, nEnd: number) => {
  return n >= nStart && n < nEnd ? true : false;
};


export const newUUID = () => {
  return uuidv4();
};