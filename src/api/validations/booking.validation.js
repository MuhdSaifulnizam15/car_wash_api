const Joi = require("joi");

const createBooking = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone_no: Joi.string().required(),
    car_plate: Joi.string().required(),
    status: Joi.string(),
    branch_id: Joi.string().required(),
  }),
};

const updateBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().required(),
  }),
};

const deleteBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().required(),
  }),
};

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
};
