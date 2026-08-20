import { celebrate, Joi, Segments } from 'celebrate';

export const validateProductId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
});

export const validateCreateProduct = celebrate({
  [Segments.BODY]: Joi.object().keys({
    // eslint-disable-next-line newline-per-chained-call
    title: Joi.string().required().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля title - 2',
      'string.max': 'Максимальная длина поля title - 30',
      'any.required': 'Поле title обязательно для заполнения',
    }),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    category: Joi.string().required(),
    price: Joi.number().positive().allow(null),
  }),
});

export const validateCreateOrder = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().positive().required(),
    items: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  }),
});
