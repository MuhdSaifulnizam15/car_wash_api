const Joi = require("joi");

const createCustomer = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone_no: Joi.string().required(),
  }),
};

const updateCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().required(),
  }),
};

const deleteCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().required(),
  }),
};

module.exports = {
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
