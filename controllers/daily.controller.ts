import * as dailyService from './../services/daily.service';
export const getMonthly = async (req, res, next) => {
  dailyService.getMonthly((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || 'no data' });
    }
    return res.status(200).send(data);
  });
};

export const getDaily = async (req, res, next) => {
  dailyService.findDaily(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || 'no data' });
    }
    return res.status(200).send(data);
  });
};

export const updateSchedule = async (req, res, next) => {
  const { time, schedule } = req.body;
  dailyService.updateSchedule(req.params.id, time, schedule, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || 'no data' });
    }
    return res.status(200).send(data);
  });
};
