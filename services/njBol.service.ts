import { connection } from '../index';
import createError from 'http-errors';

export const findDaily = (cb: any) => {
  connection.query('SELECT * from daily', (error, rows, fields) => {
    if (error) cb(createError(500, error));
    else cb(null, rows);
  });
};
