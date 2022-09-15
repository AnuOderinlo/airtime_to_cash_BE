import createError from 'http-errors'
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors'

import db from './config/database.config'

db.sync(

).then(() => {
  console.log('Database Connected Successfully')
}).catch(err => {
  console.log(err)
})


import indexRouter from './routes/indexRouter';
import usersRouter from './routes/usersRouter';

const app = express();
app.use(cors()); // included cors


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// Error handling
app.use(function (err: createError.HttpError, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
})

export default app