import { MysqlError } from 'mysql';
import { connection } from '../index';
import createError from 'http-errors';

type YN = 'Y' | 'N';
type Daily = {
  dailyId: number;
  memberId: number;
  date: Date;
  keep: string | null;
  problem: string | null;
  try: string | null;
  todoId: number;
  done: YN;
  todo: string | null;
  [key: string]: Date | number | string | null;
};

export const getMonthly = (cb: any) => {
  connection.query('SELECT * from daily', (error, rows, fields) => {
    if (error) cb(createError(500, error));
    else cb(null, rows);
  });
};

export const findDaily = (dailyId: string, cb: any) => {
  connection.query(
    `SELECT daily.dailyId, keep, problem, try, todo.*, timeTable.*
    FROM daily
    JOIN todo ON daily.dailyId = todo.dailyId
    JOIN timeTable ON timeTable.dailyId = todo.dailyId
    WHERE daily.dailyId = ${dailyId};`,
    (error: MysqlError | null, rows: Daily[], fields) => {
      if (error) cb(createError(500, error));
      else {
        if (!rows.length) {
          cb(null, null);
          return;
        }

        const { date = new Date(), keep = '', problem = '', try: tryData = [], ...restData } = rows[0];
        const { dailyId, todoId, done, memberId, todo, ...timeTable } = restData;
        const todos = rows.map((row) => ({ todoId: row.todoId, todo: row.todo, done: row.done }));
        cb(null, { date, keep, problem, try: tryData, todos, schedule: timeTable });
      }
    }
  );
};

export const createTodo = (dailyId: string, todo: string, cb: any) => {
  connection.query(`INSERT INTO todo(dailyId, todo, done) VALUES('${dailyId}', '${todo}', 'N')`, (error, rows, fields) => {
    if (error) cb(createError(500, error));
    else {
      cb(null, { message: 'success' });
    }
  });
};

export const updateTodo = (dailyId: string, todoId: string, value: string, cb: any) => {
  connection.query(
    `UPDATE todo
    SET done = '${value}'
    WHERE todo.dailyId=${dailyId} and todo.todoId=${todoId}`,
    (error, rows, fields) => {
      if (error) cb(createError(500, error));
      else {
        cb(null, { id: todoId, done: value });
      }
    }
  );
};

export const deleteTodo = (todoId: string, cb: any) => {
  connection.query(
    `DELETE FROM todo
    WHERE todo.todoId=${todoId}`,
    (error, rows, fields) => {
      if (error) cb(createError(500, error));
      else {
        cb(null, { message: 'SUCCESS' });
      }
    }
  );
};
