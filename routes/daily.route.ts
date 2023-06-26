import express from 'express';
import * as dailyController from './../controllers/daily.controller';
const dailyRouter = express.Router();

dailyRouter.get('/monthly', dailyController.getMonthly);
dailyRouter.get('/daily/:id', dailyController.getDaily);
dailyRouter.post('/daily/:id/todo', dailyController.updateTodo);

export default dailyRouter;
