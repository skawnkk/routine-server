import { MysqlError } from 'mysql';
import { connection } from '../index';
import createError from 'http-errors';

interface DailyWithTodosAndSchedule {
  date: Date;
  keep: string;
  problem: string;
  try: string[];
  todos: { todoId: number; todo: string; done: boolean }[];
  schedule: { timeId: number; time: string; task: string }[];
}

export const getMonthly = (cb: any) => {
  connection.query('SELECT * from daily', (error, rows, fields) => {
    if (error) cb(createError(500, error));
    else cb(null, rows);
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

// API분리하기
export const findDaily = (dailyId: string, cb: any) => {
  connection.query(
    `SELECT *
    FROM daily
    LEFT JOIN todo ON daily.dailyId = todo.dailyId
    LEFT JOIN _timeTable ON daily.dailyId = _timeTable.dailyId
    WHERE daily.dailyId = ${dailyId};`,
    (error: MysqlError | null, rows: any[], fields) => {
      if (error) cb(createError(500, error));
      else {
        try {
          if (!rows.length) cb(null, null);
          const { date, keep, problem, try: tryData } = rows[0];
          const todoIds = new Set();
          const todos = rows
            .filter((row) => row.todoId !== null)
            .map((row) => {
              if (todoIds.has(row.todoId)) {
                return null;
              }
              todoIds.add(row.todoId);
              return { todoId: row.todoId, todo: row.todo, done: row.done };
            })
            .filter((row) => row !== null);
          const schedule = rows.filter((row) => row.time !== null).map((row) => ({ time: row.time, task: row.task }));
          cb(null, { date, keep, problem, try: tryData, todos, schedule });
        } catch (e) {
          console.error(e);
        }
      }
    }
  );
};

export const updateSchedule = (dailyId: string, time: string, schedule: string, cb: any) => {
  connection.query(
    `INSERT INTO _timeTable (dailyId, time, task)
    VALUES ('${dailyId}', '${time}', '${schedule}')
    ON DUPLICATE KEY UPDATE task='${schedule}'`,
    (error, rows, fields) => {
      console.log(error);
      if (error) cb(createError(500, error));
      else {
        cb(null, { time, schedule });
      }
    }
  );
};

// `SELECT *
// FROM daily
// LEFT JOIN todo ON daily.dailyId = todo.dailyId
// LEFT JOIN _timeTable ON daily.dailyId = _timeTable.dailyId
// WHERE daily.dailyId = ${dailyId};`,
