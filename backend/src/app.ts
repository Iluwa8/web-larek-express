import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { requestLogger, errorLogger } from './middlewares/logger';
import orderRoutes from './routes/order';
import productRoutes from './routes/product';
import { errorHandler } from './middlewares/error-handler';

const app = express();
const PORT = 3000;

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

mongoose.connect(process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek');

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
