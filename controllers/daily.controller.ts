import * as dailyService from './../services/daily.service';
export const getMonthly = async (req, res, next) => {
  dailyService.getMonthly((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || 'no data' });
    }
    return res.status(200).send(data);
  });
};
