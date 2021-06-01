const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  requiredAnswer, emailNovalid, urlNovalid, nameMin, nameMax,
} = require('../utils/answers');

const validateAuth = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': nameMin,
        'string.max': nameMax,
        'any.required': requiredAnswer,
      }),
    email: Joi.string().required()
      .messages({
        'any.required': requiredAnswer,
      })
      .custom((value, helper) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helper.message(emailNovalid);
      }),

    password: Joi.string().required().messages({
      'any.required': requiredAnswer,
    }),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().messages({
      'any.required': requiredAnswer,
    })
      .custom((value, helper) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helper.message(emailNovalid);
      }),
    password: Joi.string().required().messages({
      'any.required': requiredAnswer,
    }),
  }).unknown(true),
});

const validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': nameMin,
        'string.max': nameMax,
      }),
    email: Joi.string().custom((value, helper) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helper.message(emailNovalid);
    }),
  }).unknown(true),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    image: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message(urlNovalid);
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message(urlNovalid);
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message(urlNovalid);
    }),
    movieId: Joi.number().messages({
      'any.required': requiredAnswer,
    }),
    country: Joi.string().required().messages({
      'any.required': requiredAnswer,
    }),
    director: Joi.string().required().messages({
      'any.required': requiredAnswer,
    }),
    duration: Joi.number().required().messages({
      'any.required': requiredAnswer,
    }),
    year: Joi.number().required().messages({
      'any.required': requiredAnswer,
    }),
    description: Joi.string().required().messages({
      'any.required': requiredAnswer,
    }),
    nameRU: Joi.string().required().messages({
      'any.required': requiredAnswer,
    }),
  }).unknown(true),
});

const validateId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helper) => {
      if (validator.isMongoId(value)) {
        return value;
      }
      return helper.message(urlNovalid);
    }),
  }),
});

module.exports = {
  validateUser, validateMovie, validateId, validateAuth, validateProfile,
};
