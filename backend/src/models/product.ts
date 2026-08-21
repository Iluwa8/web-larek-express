import mongoose from 'mongoose';

export interface IProductImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IProductImage;
  category: string;
  description?: string;
  price: number | null;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    minlength: [2, 'Минимальная длина поля title - 2'],
    maxlength: [30, 'Максимальная длина поля title - 30'],
    required: [true, 'Поле title обязательно для заполнения'],
    unique: true,
  },
  image: {
    fileName: {
      type: String,
      required: [true, 'Поле fileName обязательно для заполнения'],
    },
    originalName: {
      type: String,
      required: [true, 'Поле originalName обязательно для заполнения'],
    },
  },
  category: {
    type: String,
    required: [true, 'Поле category обязательно для заполнения'],
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    default: null,
    validate: {
      validator: (value: number | null) => value === null || value > 0,
      message: 'Цена должна быть положительным числом или null',
    },
  },
});

export default mongoose.model<IProduct>('product', productSchema);
