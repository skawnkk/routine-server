import { connection } from '../index';
import createError from 'http-errors';

export const getTodo = (dailyId: string, cb: any) => {
  connection.query(`SELECT * FROM todo where todo.dailyId=${dailyId}`, (error, rows, fields) => {
    console.log('query', error, rows);
    if (error) cb(createError(500, error));
    else {
      const data = rows.map((row) => {
        return { todoId: row.todoId, done: row.done, todo: row.todo };
      });
      cb(null, data);
    }
  });
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
