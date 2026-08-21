import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict-error';
import { InternalServerError } from '../errors/internal-server-error';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ items: products, total: products.length });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким title уже существует'));
    }
    return next(new InternalServerError('Ошибка при создании товара'));
  }
};

export default getProducts;
