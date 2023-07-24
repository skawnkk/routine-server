import express from 'express';
import * as dailyController from './../controllers/daily.controller';
const dailyRouter = express.Router();

//monthly
dailyRouter.get('/monthly', dailyController.getMonthly);
//daily
dailyRouter.get('/daily/:id', dailyController.getDaily);
//daily_todo
dailyRouter.post('/daily/:id/todo', dailyController.updateTodo);
dailyRouter.post('/daily/:id/todo/add', dailyController.createTodo);
dailyRouter.delete('/daily/:id/todo/delete', dailyController.deleteTodo);
//daily_timetable
dailyRouter.post('/daily/:id/schedule', dailyController.updateSchedule);

export default dailyRouter;
