import { connection } from '../index';
import createError from 'http-errors';

export const getMonthly = (cb: any) => {
  connection.query('SELECT * from daily', (error, rows, fields) => {
    if (error) cb(createError(500, error));
    else cb(null, rows);
  });
};

export const findDaily = (dailyId: string, cb: any) => {
  const memberId = '1';
  connection.query(
    `select *
    from daily
    inner join todo
      on todo.daily_id = ${dailyId}
      where daily.daily_id = ${dailyId} && daily.member_id = ${memberId}`,
    (error, rows, fields) => {
      if (error) cb(createError(500, error));
      else {
        console.log(rows);

        const dailyTodo = rows.map((row) => ({ todo_id: row.todo_id, todo: row.todo, done: row.done }));
        const daily = { ...rows[0], todos: dailyTodo };
        cb(null, daily);
      }
    }
  );
};

export const updateTodo = (dailyId: string, todoId: string, value: string, cb: any) => {
  console.log(todoId, value);
  connection.query(
    `UPDATE todo
    SET done = '${value}'
    where todo_id = ${todoId}`,
    (error, rows, fields) => {
      if (error) cb(createError(500, error));
      else {
        cb(null, { id: todoId, done: value });
      }
    }
  );
};
