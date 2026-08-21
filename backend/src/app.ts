import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { requestLogger, errorLogger } from './middlewares/logger';
import orderRoutes from './routes/order';
import productRoutes from './routes/product';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
const PORT = 3000;

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

mongoose.connect(process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek')
  // eslint-disable-next-line no-console
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use((_req, _res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
