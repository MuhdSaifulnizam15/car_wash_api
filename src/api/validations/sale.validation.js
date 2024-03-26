const Joi = require("joi");

const createSales = {
  body: Joi.object().keys({
    branch_id: Joi.string().required(),
    barber_id: Joi.string().required(),
    order: Joi.array().items(
      Joi.object({
        service: Joi.string().required(),
        quantity: Joi.string(),
      })
    ),
    customer_id: Joi.string(),
    customer_name: Joi.string(),
    customer_phone_no: Joi.string(),
    total: Joi.string().required(),
    rewarded_points: Joi.string(),
    freebie: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        quantity: Joi.string(),
        point: Joi.string(),
      })
    )
  }),
};

const updateSales = {
  params: Joi.object().keys({
    saleId: Joi.string().required(),
  }),
};

const deleteSales = {
  params: Joi.object().keys({
    saleId: Joi.string().required(),
  }),
};

module.exports = {
  createSales,
  updateSales,
  deleteSales,
};
