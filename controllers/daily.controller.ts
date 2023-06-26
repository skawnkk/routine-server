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

export const updateTodo = async (req, res, next) => {
  const { todoId, value } = req.body;
  dailyService.updateTodo(req.params.id, todoId, value, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || 'no data' });
    }
    return res.status(200);
  });
};
