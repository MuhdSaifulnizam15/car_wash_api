const Joi = require("joi");

const createBranch = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postcode: Joi.string().required(),
      office_no: Joi.string(),
    }),
  }),
};

const updateBranch = {
  params: Joi.object().keys({
    branchId: Joi.string().required(),
  }),
};

const deleteBranch = {
  params: Joi.object().keys({
    branchId: Joi.string().required(),
  }),
};

module.exports = {
  createBranch,
  updateBranch,
  deleteBranch,
};
