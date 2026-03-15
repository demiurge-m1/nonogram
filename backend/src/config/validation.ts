import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3333),
  HOST: Joi.string().default('0.0.0.0'),
  ALLOWED_ORIGINS: Joi.string().default('*'),
});
