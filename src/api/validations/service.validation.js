const Joi = require('joi');

const createService = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        category_id: Joi.string().required(),
        description: Joi.string(),
    }),
};

const updateService = {
    params: Joi.object().keys({
        serviceId: Joi.string().required(),
    })
};

const deleteService = {
    params: Joi.object().keys({
        serviceId: Joi.string().required(),
    })
};

const getChartData = {
  params: Joi.object().keys({
    startDate: Joi.string(),
    endDate: Joi.string()
  }),
};

module.exports = {
    createService,
    updateService,
    deleteService,
    getChartData
};