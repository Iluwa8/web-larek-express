import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';
import { BadRequestError } from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body as { total: number; items: string[] };

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      const foundIds = products.map((product) => product._id.toString());
      const missingId = items.find((itemId) => !foundIds.includes(itemId));
      return next(new BadRequestError(`Товар с id ${missingId} не найден`));
    }

    const notForSale = products.find((product) => product.price === null);
    if (notForSale) {
      return next(new BadRequestError(`Товар с id ${notForSale._id} не продается`));
    }

    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price ?? 0),
      0,
    );

    if (calculatedTotal !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    return res.status(200).json({
      id: faker.string.uuid(),
      total,
    });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
