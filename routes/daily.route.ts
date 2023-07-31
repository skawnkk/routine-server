import express from 'express';
import * as dailyController from './../controllers/daily.controller';
const dailyRouter = express.Router();

//monthly
dailyRouter.get('/monthly', dailyController.getMonthly);
//daily
dailyRouter.get('/daily/:id', dailyController.getDaily);
//daily_timetable
dailyRouter.post('/daily/:id/schedule', dailyController.updateSchedule);

export default dailyRouter;
