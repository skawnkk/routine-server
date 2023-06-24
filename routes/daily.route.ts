import express from 'express';
import * as dailyController from './../controllers/daily.controller';
const dailyRouter = express.Router();

dailyRouter.get('/', dailyController.getMonthly);

export default dailyRouter;
