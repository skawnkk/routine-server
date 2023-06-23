import * as dailyService from '../services/njBol.service';

export const getDaily = async (req, res, next) => {
  dailyService.findDaily((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || 'no data' });
    }
    return res.status(200).send(data);
  });
};
