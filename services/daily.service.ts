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

export const findDaily = (dailyId: string, cb: (error: MysqlError | null, data: DailyWithTodosAndSchedule | null) => void) => {
  const query = `
    SELECT daily.date, daily.keep, daily.problem, daily.try,
           todo.todoId, todo.todo, todo.done,
           _timeTable.time, _timeTable.task
    FROM daily
    LEFT JOIN todo ON daily.dailyId = todo.dailyId
    LEFT JOIN _timeTable ON daily.dailyId = _timeTable.dailyId
    WHERE daily.dailyId = ${dailyId};
  `;

  connection.query(query, (error: MysqlError | null, rows: any[], fields) => {
    if (error) {
      console.log(error);
      cb(createError(500), null);
      return;
    } else {
      if (!rows.length) {
        cb(null, null);
        return;
      }

      const data: DailyWithTodosAndSchedule = {
        date: rows[0].date || new Date(),
        keep: rows[0].keep || '',
        problem: rows[0].problem || '',
        try: rows[0].try ? rows[0].try.split(',') : [],
        todos: rows.map((row) => ({ todoId: row.todoId, todo: row.todo, done: row.done })),
        schedule: rows.map((row) => ({ timeId: row.timeId, time: row.time, task: row.task })).filter((e) => e),
      };

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
