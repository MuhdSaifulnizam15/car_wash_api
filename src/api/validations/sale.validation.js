const Joi = require("joi");

const createSales = {
  body: Joi.object().keys({
    branch_id: Joi.string().required(),
    barber_id: Joi.string().required(),
    order: Joi.array().items(
      Joi.object({
        service: Joi.string().required(),
        quantity: Joi.number(),
      })
    ),
    customer_id: Joi.string(),
    customer_name: Joi.string(),
    customer_phone_no: Joi.string(),
    total: Joi.string().required(),
    total_redeemed_point: Joi.number(),
    total_rewarded_point: Joi.number(),
    freebie: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        quantity: Joi.number(),
        point: Joi.number(),
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
