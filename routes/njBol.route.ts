import express from 'express';
import * as dailyController from '../controllers/njBol.controller';
const dailyRouter = express.Router();

dailyRouter.get('/', dailyController.getDaily);

export default dailyRouter;
