import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';
import { dbConfig } from './models/db';
import dailyRouter from './routes/daily.route';
const app = express();
export const connection = mysql.createConnection(dbConfig);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.json({ message: 'Hello World2!' });
});

app.use('/daily', dailyRouter);

const port = 8080;
app.listen(port, () => {
  console.log('HELLO !');
});
